
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Star, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  title: string;
  content: string;
}

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: 'About Us',
    content: 'We provide professional government, IT, and tax services with over 5 years of experience.'
  });

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .in('section_name', ['about_title', 'about_content'])
        .eq('is_active', true);

      if (error) throw error;

      if (data && data.length > 0) {
        const titleContent = data.find(item => item.section_name === 'about_title');
        const bodyContent = data.find(item => item.section_name === 'about_content');
        
        setAboutContent({
          title: titleContent?.content || 'About Us',
          content: bodyContent?.content || 'We provide professional government, IT, and tax services with over 5 years of experience.'
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    }
  };

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{aboutContent.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutContent.content}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg">500+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-lg">5 Years</h3>
                <p className="text-gray-600">Experience</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  To provide reliable, efficient, and professional services that help our clients 
                  navigate government processes, solve IT challenges, and manage their tax obligations 
                  with ease and confidence.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  Why Choose Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Professional and experienced team</li>
                  <li>• Quick turnaround times</li>
                  <li>• Competitive pricing</li>
                  <li>• 24/7 customer support</li>
                  <li>• Trusted by 500+ clients</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
