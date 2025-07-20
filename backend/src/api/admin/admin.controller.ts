import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

// User Management Endpoints

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Build query
    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    
    if (status === 'active') {
      query = query.eq('is_suspended', false);
    } else if (status === 'suspended') {
      query = query.eq('is_suspended', true);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company_name.ilike.%${search}%`);
    }

    // Execute query with pagination
    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      logger.error('Error fetching users:', error);
      throw new AppError('Failed to fetch users', 500);
    }

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function suspendUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new AppError('Suspension reason is required', 400);
    }

    // Update user profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        is_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        suspended_by: req.user?.id
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error suspending user:', error);
      throw new AppError('Failed to suspend user', 500);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'user_suspended', { userId, reason });

    res.json({
      message: 'User suspended successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function activateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    // Update user profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null,
        suspended_by: null
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error activating user:', error);
      throw new AppError('Failed to activate user', 500);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'user_activated', { userId });

    res.json({
      message: 'User activated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['playwright', 'theater_company', 'admin'];
    if (!validRoles.includes(role)) {
      throw new AppError('Invalid role', 400);
    }

    // Prevent removing the last admin
    if (role !== 'admin') {
      const { count } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')
        .neq('user_id', userId);

      if (count === 0) {
        throw new AppError('Cannot remove the last admin', 400);
      }
    }

    // Update user role
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating user role:', error);
      throw new AppError('Failed to update user role', 500);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'role_updated', { userId, role });

    res.json({
      message: 'User role updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
}

// Script Moderation Endpoints

export async function listPendingScripts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { data: scripts, error, count } = await supabaseAdmin
      .from('scripts')
      .select(`
        *,
        profiles!scripts_playwright_id_fkey(
          id,
          email,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) {
      logger.error('Error fetching pending scripts:', error);
      throw new AppError('Failed to fetch pending scripts', 500);
    }

    res.json({
      scripts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function approveScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { scriptId } = req.params;
    const { notes } = req.body;

    const { data: script, error } = await supabaseAdmin
      .from('scripts')
      .update({
        status: 'approved',
        moderation_notes: notes,
        moderated_at: new Date().toISOString(),
        moderated_by: req.user?.id
      })
      .eq('id', scriptId)
      .select()
      .single();

    if (error) {
      logger.error('Error approving script:', error);
      throw new AppError('Failed to approve script', 500);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'script_approved', { scriptId, notes });

    res.json({
      message: 'Script approved successfully',
      script
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { scriptId } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      throw new AppError('Rejection reason is required', 400);
    }

    const { data: script, error } = await supabaseAdmin
      .from('scripts')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        moderation_notes: notes,
        moderated_at: new Date().toISOString(),
        moderated_by: req.user?.id
      })
      .eq('id', scriptId)
      .select()
      .single();

    if (error) {
      logger.error('Error rejecting script:', error);
      throw new AppError('Failed to reject script', 500);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'script_rejected', { scriptId, reason, notes });

    res.json({
      message: 'Script rejected successfully',
      script
    });
  } catch (error) {
    next(error);
  }
}

export async function flagScript(req: Request, res: Response, next: NextFunction) {
  try {
    const { scriptId } = req.params;
    const { reason, severity = 'low' } = req.body;

    if (!reason) {
      throw new AppError('Flag reason is required', 400);
    }

    // Create flag record
    const { data: flag, error } = await supabaseAdmin
      .from('script_flags')
      .insert({
        script_id: scriptId,
        flagged_by: req.user?.id,
        reason,
        severity,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      logger.error('Error flagging script:', error);
      throw new AppError('Failed to flag script', 500);
    }

    // Update script status if high severity
    if (severity === 'high') {
      await supabaseAdmin
        .from('scripts')
        .update({ status: 'flagged' })
        .eq('id', scriptId);
    }

    // Log admin action
    await logAdminAction(req.user!.id, 'script_flagged', { scriptId, reason, severity });

    res.json({
      message: 'Script flagged successfully',
      flag
    });
  } catch (error) {
    next(error);
  }
}

// Revenue Analytics Endpoints

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {
      start: startDate || new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
      end: endDate || new Date().toISOString()
    };

    // Get user stats
    const { data: userStats } = await supabaseAdmin
      .from('profiles')
      .select('role', { count: 'exact' })
      .in('role', ['playwright', 'theater_company']);

    // Get script stats
    const { data: scriptStats } = await supabaseAdmin
      .from('scripts')
      .select('status', { count: 'exact' });

    // Get license stats
    const { data: licenseStats } = await supabaseAdmin
      .from('licenses')
      .select('type', { count: 'exact' })
      .gte('created_at', dateFilter.start)
      .lte('created_at', dateFilter.end);

    // Get revenue stats
    const { data: revenueData } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', dateFilter.start)
      .lte('created_at', dateFilter.end);

    const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    // Get platform fee revenue
    const { data: feeData } = await supabaseAdmin
      .from('payments')
      .select('platform_fee')
      .eq('status', 'completed')
      .gte('created_at', dateFilter.start)
      .lte('created_at', dateFilter.end);

    const totalFees = feeData?.reduce((sum, payment) => sum + payment.platform_fee, 0) || 0;

    res.json({
      users: {
        playwrights: userStats?.filter(u => u.role === 'playwright').length || 0,
        theaters: userStats?.filter(u => u.role === 'theater_company').length || 0,
        total: userStats?.length || 0
      },
      scripts: {
        approved: scriptStats?.filter(s => s.status === 'approved').length || 0,
        pending: scriptStats?.filter(s => s.status === 'pending_review').length || 0,
        rejected: scriptStats?.filter(s => s.status === 'rejected').length || 0,
        total: scriptStats?.length || 0
      },
      licenses: {
        perusal: licenseStats?.filter(l => l.type === 'perusal').length || 0,
        performance: licenseStats?.filter(l => l.type === 'performance').length || 0,
        total: licenseStats?.length || 0
      },
      revenue: {
        total: totalRevenue,
        platformFees: totalFees,
        period: dateFilter
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getRevenueTrends(req: Request, res: Response, next: NextFunction) {
  try {
    const { period = 'daily', days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('amount, platform_fee, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching revenue trends:', error);
      throw new AppError('Failed to fetch revenue trends', 500);
    }

    // Group by period
    const trends = groupPaymentsByPeriod(payments || [], period as string);

    res.json({
      trends,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getPlatformMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    // Get active user metrics (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: activeUsers } = await supabaseAdmin
      .from('profiles')
      .select('role', { count: 'exact' })
      .gte('last_login_at', thirtyDaysAgo.toISOString());

    // Get conversion metrics
    const { data: perusalLicenses } = await supabaseAdmin
      .from('licenses')
      .select('script_id', { count: 'exact' })
      .eq('type', 'perusal');

    const { data: performanceLicenses } = await supabaseAdmin
      .from('licenses')
      .select('script_id', { count: 'exact' })
      .eq('type', 'performance')
      .in('script_id', perusalLicenses?.map(l => l.script_id) || []);

    const conversionRate = perusalLicenses?.length 
      ? (performanceLicenses?.length || 0) / perusalLicenses.length * 100 
      : 0;

    // Get average transaction value
    const { data: avgTransaction } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    const avgValue = avgTransaction?.length 
      ? avgTransaction.reduce((sum, p) => sum + p.amount, 0) / avgTransaction.length 
      : 0;

    // Get top performing scripts
    const { data: topScripts } = await supabaseAdmin
      .from('licenses')
      .select(`
        script_id,
        scripts!inner(
          id,
          title,
          playwright_id
        )
      `)
      .limit(10);

    res.json({
      activeUsers: {
        total: activeUsers?.length || 0,
        playwrights: activeUsers?.filter(u => u.role === 'playwright').length || 0,
        theaters: activeUsers?.filter(u => u.role === 'theater_company').length || 0
      },
      conversion: {
        perusalToPerformance: conversionRate.toFixed(2) + '%',
        totalPerusals: perusalLicenses?.length || 0,
        totalPerformances: performanceLicenses?.length || 0
      },
      transactions: {
        averageValue: avgValue.toFixed(2),
        totalTransactions: avgTransaction?.length || 0
      },
      topScripts: topScripts || []
    });
  } catch (error) {
    next(error);
  }
}

// Helper Functions

async function logAdminAction(adminId: string, action: string, details: any) {
  try {
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: adminId,
        action,
        details,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    logger.error('Error logging admin action:', error);
  }
}

function groupPaymentsByPeriod(payments: any[], period: string) {
  const grouped: { [key: string]: { revenue: number; fees: number; count: number } } = {};

  payments.forEach(payment => {
    const date = new Date(payment.created_at);
    let key: string;

    switch (period) {
      case 'hourly':
        key = `${date.toISOString().split('T')[0]}T${date.getHours().toString().padStart(2, '0')}:00`;
        break;
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = { revenue: 0, fees: 0, count: 0 };
    }

    grouped[key].revenue += payment.amount;
    grouped[key].fees += payment.platform_fee;
    grouped[key].count += 1;
  });

  return Object.entries(grouped).map(([date, data]) => ({
    date,
    ...data
  }));
}