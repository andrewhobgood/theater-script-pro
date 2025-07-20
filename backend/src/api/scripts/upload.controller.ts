import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../services/supabase';
import { uploadToS3, createPerusalScript, deleteFromS3 } from '../../services/storage';
import { AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { config } from '../../config';

export async function uploadScriptFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: scriptId } = req.params;
    const playwrightId = req.profile!.id;

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Verify script ownership
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('id, playwright_id, file_url, perusal_url')
      .eq('id', scriptId)
      .eq('playwright_id', playwrightId)
      .single();

    if (scriptError || !script) {
      throw new AppError('Script not found or access denied', 404);
    }

    // Delete old files if they exist
    if (script.file_url) {
      try {
        const oldKey = script.file_url.split('/').slice(-2).join('/');
        await deleteFromS3(config.aws.s3.scriptsBucket, oldKey);
      } catch (error) {
        logger.error('Error deleting old script file:', error);
      }
    }

    // Upload full script
    const fullScriptUpload = await uploadToS3(
      req.file,
      config.aws.s3.scriptsBucket,
      `scripts/${playwrightId}`,
      `${scriptId}-full`
    );

    // Create and upload perusal script
    const perusalBuffer = await createPerusalScript(req.file);
    const perusalFile = {
      ...req.file,
      buffer: perusalBuffer,
      originalname: `perusal-${req.file.originalname}`,
    } as Express.Multer.File;

    const perusalUpload = await uploadToS3(
      perusalFile,
      config.aws.s3.perusalBucket,
      `scripts/${playwrightId}`,
      `${scriptId}-perusal`
    );

    // Update script with file URLs
    const { data: updatedScript, error: updateError } = await supabaseAdmin
      .from('scripts')
      .update({
        file_url: fullScriptUpload.url,
        perusal_url: perusalUpload.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scriptId)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating script file URLs:', updateError);
      throw new AppError('Failed to update script', 500);
    }

    res.json({
      message: 'Script file uploaded successfully',
      script: {
        id: updatedScript.id,
        file_url: updatedScript.file_url,
        perusal_url: updatedScript.perusal_url,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadCoverImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: scriptId } = req.params;
    const playwrightId = req.profile!.id;

    if (!req.file) {
      throw new AppError('No image uploaded', 400);
    }

    // Verify script ownership
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('id, playwright_id, cover_image_url')
      .eq('id', scriptId)
      .eq('playwright_id', playwrightId)
      .single();

    if (scriptError || !script) {
      throw new AppError('Script not found or access denied', 404);
    }

    // Delete old image if exists
    if (script.cover_image_url) {
      try {
        const oldKey = script.cover_image_url.split('/').slice(-2).join('/');
        await deleteFromS3(config.aws.s3.scriptsBucket, oldKey);
      } catch (error) {
        logger.error('Error deleting old cover image:', error);
      }
    }

    // Upload new cover image
    const imageUpload = await uploadToS3(
      req.file,
      config.aws.s3.scriptsBucket,
      `covers/${playwrightId}`,
      `${scriptId}-cover`
    );

    // Update script with image URL
    const { data: updatedScript, error: updateError } = await supabaseAdmin
      .from('scripts')
      .update({
        cover_image_url: imageUpload.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scriptId)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating script cover image:', updateError);
      throw new AppError('Failed to update cover image', 500);
    }

    res.json({
      message: 'Cover image uploaded successfully',
      script: {
        id: updatedScript.id,
        cover_image_url: updatedScript.cover_image_url,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteScriptFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: scriptId } = req.params;
    const playwrightId = req.profile!.id;

    // Verify script ownership
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('scripts')
      .select('id, playwright_id, file_url, perusal_url')
      .eq('id', scriptId)
      .eq('playwright_id', playwrightId)
      .single();

    if (scriptError || !script) {
      throw new AppError('Script not found or access denied', 404);
    }

    // Delete files from S3
    const deletePromises = [];

    if (script.file_url) {
      const fullKey = script.file_url.split('/').slice(-2).join('/');
      deletePromises.push(deleteFromS3(config.aws.s3.scriptsBucket, fullKey));
    }

    if (script.perusal_url) {
      const perusalKey = script.perusal_url.split('/').slice(-2).join('/');
      deletePromises.push(deleteFromS3(config.aws.s3.perusalBucket, perusalKey));
    }

    await Promise.all(deletePromises);

    // Update script to remove file URLs
    await supabaseAdmin
      .from('scripts')
      .update({
        file_url: null,
        perusal_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', scriptId);

    res.json({
      message: 'Script files deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}