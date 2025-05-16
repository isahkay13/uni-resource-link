
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, File, Book } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-university-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 py-16 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">
                Welcome to UniConnect
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Your university's secure platform for file sharing,
                messaging, and collaborative learning
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-university-primary hover:bg-blue-50">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-900">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="w-full h-72 md:h-96 bg-university-secondary rounded-lg shadow-xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-university-primary">U</span>
                      </div>
                      <p className="text-xl font-medium">University Platform</p>
                      <p className="opacity-75">App Screenshot</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-university-secondary/10 rounded-full flex items-center justify-center mb-4">
                <div className="text-university-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Secure Messaging</h3>
              <p className="text-gray-600">
                Connect with peers and staff through private and group messaging. Collaboration made simple.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-university-secondary/10 rounded-full flex items-center justify-center mb-4">
                <div className="text-university-primary">
                  <File className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">File Sharing</h3>
              <p className="text-gray-600">
                Upload and share files up to 100MB with your classmates and professors securely.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-university-secondary/10 rounded-full flex items-center justify-center mb-4">
                <div className="text-university-primary">
                  <Book className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">Tutorial Library</h3>
              <p className="text-gray-600">
                Create and share educational content with your university community. Learn together.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of students and staff who are already using UniConnect to enhance their university experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-university-primary hover:bg-university-secondary">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-university-primary text-university-primary hover:bg-university-primary/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
