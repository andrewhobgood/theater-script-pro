declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      
      // Supabase
      SUPABASE_URL: string;
      SUPABASE_SERVICE_KEY: string;
      
      // AWS
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      S3_BUCKET_SCRIPTS: string;
      S3_BUCKET_PERUSAL: string;
      
      // Stripe
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      
      // Resend
      RESEND_API_KEY: string;
      RESEND_FROM_EMAIL: string;
      
      // Security
      JWT_SECRET: string;
      ENCRYPTION_KEY: string;
      
      // Frontend
      FRONTEND_URL: string;
    }
  }
}

export {};