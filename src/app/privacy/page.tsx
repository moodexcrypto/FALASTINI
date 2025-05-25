import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
          <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

          <p>
            Falastini ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application (the "App"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the app.
          </p>

          <h2 className="text-xl font-semibold pt-4">Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect via the App depends on the content and materials you use, and includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Personal Data:</strong> While using our donation features or support forms, you may voluntarily provide us with certain personally identifiable information, such as your name and email address when submitting messages or support requests. Uploaded bank proofs are stored securely and accessed only for verification purposes.</li>
            <li><strong>Donation Messages:</strong> If you choose to leave a public message, the content of the message and the name provided (or "Anonymous") will be publicly visible.</li>
             <li><strong>Ad Interaction Data (Optional):</strong> If implemented, we might collect anonymized data related to ad interactions (e.g., clicks, views via Firebase `/adStats`) to estimate revenue and improve the service. This data typically does not include personally identifiable information like your specific identity but might involve IP addresses for fraud prevention, collected by Firebase Functions or the ad network itself according to their policies.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the App, such as your IP address, browser type, operating system, access times, etc., collected via standard server logs or Firebase services for security and operational purposes.</li>
          </ul>

           <h2 className="text-xl font-semibold pt-4">Use of Your Information</h2>
           <p>
             Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the App to:
           </p>
           <ul className="list-disc list-inside space-y-1 pl-4">
             <li>Process donations and verify bank transfers.</li>
             <li>Display public messages of support on the App.</li>
             <li>Respond to your support requests and inquiries.</li>
             <li>Monitor and analyze usage and trends to improve your experience with the App.</li>
             <li>Estimate and report on revenue generated through ad views.</li>
             <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
           </ul>

           <h2 className="text-xl font-semibold pt-4">Disclosure of Your Information</h2>
            <p>We do not sell or rent your personal information. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
           <ul className="list-disc list-inside space-y-1 pl-4">
             <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services (like Firebase), customer service, and ad networks (like Adsterra, subject to their privacy policies).</li>
               <li><strong>Public Messages:</strong> Messages you designate as public will be visible to other users of the App.</li>
           </ul>


          <h2 className="text-xl font-semibold pt-4">Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-xl font-semibold pt-4">Policy for Children</h2>
          <p>
            We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible.
          </p>

          <h2 className="text-xl font-semibold pt-4">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-semibold pt-4">Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: [Your Contact Email Address]
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    