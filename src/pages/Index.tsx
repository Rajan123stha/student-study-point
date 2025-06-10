import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, FileText, GraduationCap, Bookmark } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow mt-4">
        {/* Hero Section */}
        <section className="hero-section py-16 md:py-24 px-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-4xl font-bold mb-4 gradient-heading">
                  Your Academic Success Hub
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Access high-quality learning resources, past exam questions,
                  and comprehensive notes all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link to="/resources">Browse Resources</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Students studying"
                  className="rounded-lg shadow-lg object-cover h-64 w-full md:h-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              What We Offer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                  <Book size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Course Notes</h3>
                <p className="text-gray-600 text-lg">
                  Comprehensive, well-structured notes for all subjects
                  organized by semester.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Past Exams</h3>
                <p className="text-gray-600 text-lg">
                  Previous years' question papers with solutions to help you
                  prepare effectively.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Bookmark size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Syllabus</h3>
                <p className="text-gray-600 text-lg">
                  Latest curriculum and syllabus information for each subject in
                  the program.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Excel in Your Studies?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using EduResources to
              achieve academic excellence.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/resources">Explore Resources Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
