
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '../../context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Navigate, Link } from 'react-router-dom';
import { UserRole } from '../../types';

const Register = () => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated } = useAuth();

  const handleNext = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      toast.error(`Please enter your ${role === 'student' ? 'university ID' : 'university email'}`);
      return;
    }

    // Staff should use email
    if (role !== 'student' && !identifier.includes('@')) {
      toast.error('Please enter a valid university email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, identifier, role);
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
          <CardTitle className="text-2xl text-center">Join UniConnect</CardTitle>
          <CardDescription className="text-center">
            Create your account to access university resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="academic" />
                    <Label htmlFor="academic" className="cursor-pointer">Academic Staff</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nonacademic" id="nonacademic" />
                    <Label htmlFor="nonacademic" className="cursor-pointer">Non-Academic Staff</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button className="w-full mt-6" onClick={handleNext}>
                Next
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {role === 'student' ? 'University ID' : 'University Email'}
                </Label>
                <Input
                  id="identifier"
                  placeholder={role === 'student' ? 'e.g., ST12345' : 'name@university.edu'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  type={role === 'student' ? 'text' : 'email'}
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-university-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
