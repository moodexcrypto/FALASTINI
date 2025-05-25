import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
           <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

          <p>
            Welcome to Falastini (the "App"). These Terms of Service ("Terms") govern your use of the App provided by [Your Organization Name or "Us"]. By accessing or using the App, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the App.
          </p>

          <h2 className="text-xl font-semibold pt-4">1. Use of the App</h2>
          <p>
            The App provides information and facilitates donations (via crypto, bank transfer, and ad viewing) and support coordination for humanitarian aid related to Palestine. You agree to use the App only for lawful purposes and in accordance with these Terms.
          </p>

          <h2 className="text-xl font-semibold pt-4">2. Donations</h2>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Accuracy:</strong> You are responsible for ensuring the accuracy of any donation information you provide (e.g., crypto wallet addresses, bank transfer details). We are not liable for errors in transactions resulting from incorrect information provided by you.</li>
            <li><strong>Verification:</strong> Bank transfer donations may require proof of transfer for verification. Uploaded proofs will be handled according to our Privacy Policy.</li>
            <li><strong>Ad Revenue:</strong> Revenue generated from watching ads is based on agreements with third-party ad networks (e.g., Adsterra) and is subject to their terms and reporting. The displayed estimated revenue is an approximation and the final donated amount may vary based on the ad network's calculations and payout schedules. We commit to transparency regarding the donation process.</li>
            <li><strong>No Refunds:</strong> All donations made through any method are final and non-refundable.</li>
             <li><strong>Use of Funds:</strong> We commit to using donated funds for humanitarian aid purposes in Palestine, supporting initiatives like medical aid, food distribution, education, and shelter, potentially through partner NGOs. We strive for transparency in fund allocation, which may be detailed in reports within the App or associated communications.</li>
          </ul>

           <h2 className="text-xl font-semibold pt-4">3. User Content</h2>
           <p>
             If you submit content, such as messages of support:
           </p>
           <ul className="list-disc list-inside space-y-1 pl-4">
             <li>You grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your public content within the App and related promotional materials.</li>
             <li>You are responsible for the content you submit and warrant that it does not infringe on any third-party rights or contain unlawful material.</li>
             <li>We reserve the right, but not the obligation, to remove or modify user content that violates these Terms or is otherwise objectionable.</li>
           </ul>

           <h2 className="text-xl font-semibold pt-4">4. Intellectual Property</h2>
           <p>
             The App and its original content (excluding user content), features, and functionality are and will remain the exclusive property of [Your Organization Name or "Us"] and its licensors. The App is protected by copyright, trademark, and other laws of both [Your Country] and foreign countries.
           </p>

           <h2 className="text-xl font-semibold pt-4">5. Disclaimers</h2>
            <p>The App is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the App, or the information, content, or materials included therein. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
             <p>Information provided in the "Stories" section is for informational purposes only and is gathered from various sources; while we strive for accuracy, we cannot guarantee it in all cases.</p>


           <h2 className="text-xl font-semibold pt-4">6. Limitation of Liability</h2>
           <p>
             In no event shall [Your Organization Name or "Us"], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the App; (ii) any conduct or content of any third party on the App; (iii) any content obtained from the App; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
           </p>

           <h2 className="text-xl font-semibold pt-4">7. Governing Law</h2>
           <p>
             These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction, e.g., State/Country], without regard to its conflict of law provisions.
           </p>

           <h2 className="text-xl font-semibold pt-4">8. Changes to Terms</h2>
           <p>
             We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our App after any revisions become effective, you agree to be bound by the revised terms.
           </p>

           <h2 className="text-xl font-semibold pt-4">9. Contact Us</h2>
           <p>
             If you have any questions about these Terms, please contact us at: [Your Contact Email Address]
           </p>
        </CardContent>
      </Card>
    </div>
  );
}

    