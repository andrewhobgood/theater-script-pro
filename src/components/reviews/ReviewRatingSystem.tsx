import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, Reply, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    totalReviews: number;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  replies: Reply[];
  verified: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
    isPlaywright: boolean;
  };
  content: string;
  date: string;
}

interface ReviewRatingSystemProps {
  scriptId: string;
  averageRating: number;
  totalReviews: number;
}

export function ReviewRatingSystem({ scriptId, averageRating, totalReviews }: ReviewRatingSystemProps) {
  const [newReview, setNewReview] = useState({ rating: 0, title: '', content: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock data
  const reviews: Review[] = [
    {
      id: '1',
      author: {
        name: 'Emily Rodriguez',
        avatar: '/placeholder.svg',
        verified: true,
        totalReviews: 23
      },
      rating: 5,
      title: 'Absolutely brilliant writing!',
      content: 'This script captured my heart from the first scene. The character development is exceptional, and the dialogue feels so natural. I\'ve performed in several productions, and this is by far one of the best scripts I\'ve worked with.',
      date: '2024-01-15',
      helpful: 12,
      notHelpful: 1,
      verified: true,
      replies: [
        {
          id: 'r1',
          author: {
            name: 'Michael Chen',
            avatar: '/placeholder.svg',
            isPlaywright: true
          },
          content: 'Thank you so much for your kind words, Emily! It means the world to hear from someone who has brought the characters to life.',
          date: '2024-01-16'
        }
      ]
    },
    {
      id: '2',
      author: {
        name: 'David Thompson',
        avatar: '/placeholder.svg',
        verified: false,
        totalReviews: 7
      },
      rating: 4,
      title: 'Great script with minor pacing issues',
      content: 'The story is compelling and the characters are well-developed. However, I found Act II to be slightly slow-paced. With some minor adjustments, this could easily be a 5-star script.',
      date: '2024-01-12',
      helpful: 8,
      notHelpful: 3,
      verified: false,
      replies: []
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 65 },
    { stars: 4, count: 15, percentage: 22 },
    { stars: 3, count: 6, percentage: 9 },
    { stars: 2, count: 2, percentage: 3 },
    { stars: 1, count: 1, percentage: 1 }
  ];

  const handleSubmitReview = () => {
    console.log('Submitting review:', newReview);
    setNewReview({ rating: 0, title: '', content: '' });
  };

  const handleReply = (reviewId: string) => {
    console.log('Replying to review:', reviewId, replyContent);
    setShowReplyForm(null);
    setReplyContent('');
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }: {
    rating: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive ? () => onRatingChange?.(star) : undefined}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{averageRating}</div>
              <StarRating rating={averageRating} />
              <p className="text-muted-foreground mt-2">{totalReviews} reviews</p>
            </div>
            
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{dist.stars}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating</label>
            <StarRating
              rating={newReview.rating}
              interactive
              onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Review Title</label>
            <input
              type="text"
              placeholder="Summarize your review..."
              className="w-full p-2 border rounded-md"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Your Review</label>
            <Textarea
              placeholder="Share your thoughts about this script..."
              rows={4}
              value={newReview.content}
              onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>
          
          <Button 
            onClick={handleSubmitReview}
            disabled={!newReview.rating || !newReview.content}
            className="w-full"
          >
            Submit Review
          </Button>
        </CardContent>
      </Card>

      {/* Filter and Sort */}
      <div className="flex flex-wrap gap-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={review.author.avatar} />
                  <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{review.author.name}</h4>
                        {review.author.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">Verified Purchase</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.author.totalReviews} reviews
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Flag className="h-4 w-4 mr-2" />
                          Report Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">{review.title}</h5>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.helpful}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {review.notHelpful}
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReplyForm(review.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                  
                  {/* Replies */}
                  {review.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 ml-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatar} />
                            <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{reply.author.name}</span>
                              {reply.author.isPlaywright && (
                                <Badge variant="outline" className="text-xs">Author</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{reply.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Reply Form */}
                  {showReplyForm === review.id && (
                    <div className="mt-4 ml-4 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleReply(review.id)}
                          disabled={!replyContent.trim()}
                        >
                          Post Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowReplyForm(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}