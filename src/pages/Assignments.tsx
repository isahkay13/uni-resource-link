
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User, BookOpen, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  course: string;
  instructor: string;
  dueDate: string;
  submittedDate?: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  totalPoints: number;
  submissionType: 'file' | 'text' | 'both';
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Database Design Project',
    description: 'Design a complete database schema for a university management system including students, courses, and grades.',
    course: 'CS 4350 - Database Systems',
    instructor: 'Dr. Smith',
    dueDate: '2024-01-15T23:59:00',
    status: 'pending',
    totalPoints: 100,
    submissionType: 'both'
  },
  {
    id: '2',
    title: 'React Components Assignment',
    description: 'Create reusable React components following best practices and implement proper state management.',
    course: 'CS 3320 - Web Development',
    instructor: 'Prof. Johnson',
    dueDate: '2024-01-12T23:59:00',
    submittedDate: '2024-01-11T18:30:00',
    status: 'submitted',
    totalPoints: 75,
    submissionType: 'file'
  },
  {
    id: '3',
    title: 'Linear Algebra Problem Set',
    description: 'Complete problems 1-15 from Chapter 8 focusing on eigenvalues and eigenvectors.',
    course: 'MATH 2350 - Linear Algebra',
    instructor: 'Dr. Williams',
    dueDate: '2024-01-10T23:59:00',
    submittedDate: '2024-01-10T20:15:00',
    status: 'graded',
    grade: 'A-',
    totalPoints: 50,
    submissionType: 'text'
  },
  {
    id: '4',
    title: 'Research Paper Draft',
    description: 'Submit a 10-page draft of your research paper on artificial intelligence ethics.',
    course: 'PHIL 4200 - Ethics in Technology',
    instructor: 'Dr. Brown',
    dueDate: '2024-01-05T23:59:00',
    status: 'overdue',
    totalPoints: 150,
    submissionType: 'file'
  }
];

const Assignments = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'overdue'>('all');

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAssignments = filter === 'all' 
    ? mockAssignments 
    : mockAssignments.filter(assignment => assignment.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string, status: Assignment['status']) => {
    return new Date(dueDate) < new Date() && status === 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">Manage your coursework and track submission deadlines</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'submitted', 'graded', 'overdue'] as const).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption === 'all' ? 'All Assignments' : filterOption}
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {filterOption === 'all' 
                  ? mockAssignments.length 
                  : mockAssignments.filter(a => a.status === filterOption).length
                }
              </Badge>
            </Button>
          ))}
        </div>

        {/* Assignments Grid */}
        <div className="grid gap-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{assignment.title}</CardTitle>
                    <CardDescription className="text-base">
                      {assignment.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    className={`ml-4 ${getStatusColor(assignment.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(assignment.status)}
                    {assignment.status === 'graded' && assignment.grade ? assignment.grade : assignment.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{assignment.course}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{assignment.instructor}</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-sm ${
                    isOverdue(assignment.dueDate, assignment.status) ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{assignment.totalPoints} points</span>
                  </div>
                </div>

                {assignment.submittedDate && (
                  <div className="text-sm text-green-600 mb-4">
                    Submitted: {formatDate(assignment.submittedDate)}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Submission type: {assignment.submissionType === 'both' ? 'File & Text' : assignment.submissionType}
                  </div>
                  
                  <div className="flex gap-2">
                    {assignment.status === 'pending' && (
                      <Button size="sm" className="bg-university-primary hover:bg-university-secondary">
                        Submit Assignment
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'You have no assignments at the moment.' 
                : `You have no ${filter} assignments.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
