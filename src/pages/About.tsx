import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Book,
  GraduationCap,
  FileText,
  BookOpen,
  Users,
  Coffee,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow mt-4">
        {/* Hero Section */}
        <section className="bg-gray-50 py-16 ">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6 gradient-heading">
                About EduResources
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                We're on a mission to make quality academic resources freely
                accessible to all students, helping them excel in their studies
                and academic journey.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                  alt="Students studying together"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  EduResources was founded by a group of BCA students who
                  personally experienced the struggle of finding reliable
                  academic materials during their college years. We know how
                  challenging it can be to prepare for exams or grasp complex
                  topics without the right resources.
                </p>
                <p className="text-gray-700 mb-4">
                  One of the key moments that inspired this platform came from a
                  conversation with my younger brother, a BBA student. He was
                  frustrated by the lack of easily accessible notes and old
                  question papers. One day, he asked me, "Can you build a site
                  where I can find everything in one place?"
                </p>

                <p className="text-gray-700">
                  That question stuck with me — and it became the driving force
                  behind EduResources.
                </p>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Our platform includes:
                </h2>
                <ul className="list-none space-y-2 text-gray-700">
                  <li>📚 Comprehensive notes</li>
                  <li>📝 Previous year question papers</li>
                  <li>📖 Official syllabi</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What We Offer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Comprehensive Notes
                </h3>
                <p className="text-gray-600">
                  Detailed, well-structured subject notes created by top
                  students and experienced educators.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Past Exam Questions
                </h3>
                <p className="text-gray-600">
                  Access to previous years' question papers with solutions to
                  help you prepare effectively.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Book size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Official Syllabi</h3>
                <p className="text-gray-600">
                  Current and updated course syllabi for all semesters to guide
                  your study plan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
              We're a small team of dedicated BCA students passionate about
              improving access to quality learning resources.
            </p>

            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/resources">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Resources
                </Link>
              </Button>
            </div>
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Explore the Resources</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Start exploring our collection of academic resources to enhance
              your learning experience and achieve better results in your
              academic journey.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/resources">Explore Resources</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
