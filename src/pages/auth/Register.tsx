
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.enum(['student', 'academic', 'nonacademic'] as const),
  identifier: z.string().min(2, { message: 'Required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isAuthenticated } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      role: 'student',
      identifier: '',
      password: '',
      confirmPassword: '',
    },
  });

  const role = form.watch('role');

  const handleNext = () => {
    form.trigger(['name', 'role']);
    const nameError = form.formState.errors.name;
    const roleError = form.formState.errors.role;
    
    if (!nameError && !roleError) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);

    try {
      await register(
        values.name, 
        values.identifier, 
        values.role as UserRole, 
        values.password
      );
      toast.success('Registration successful');
    } catch (error) {
      // Error handling is done in the register function
      console.error('Registration error:', error);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {currentStep === 1 ? (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>I am a:</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="space-y-2"
                          >
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    className="w-full mt-6" 
                    onClick={handleNext} 
                    type="button"
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {role === 'student' ? 'University ID' : 'University Email'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={role === 'student' ? 'e.g., ST12345' : 'name@university.edu'}
                            type={role === 'student' ? 'text' : 'email'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                </div>
              )}
            </form>
          </Form>
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
