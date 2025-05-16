
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Navigate, Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your university ID or email');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(identifier);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-university-primary flex items-center justify-center text-white font-bold text-2xl">
            U
          </div>
          <CardTitle className="text-2xl text-center">Welcome to UniConnect</CardTitle>
          <CardDescription className="text-center">
            Enter your university ID or email to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="identifier">University ID or Email</Label>
              <Input
                id="identifier"
                placeholder="e.g., ST12345 or name@university.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                For demo: Try EJ2023 (student) or ibukun@university.edu (academic)
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-university-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
