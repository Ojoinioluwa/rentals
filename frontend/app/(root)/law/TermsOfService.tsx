import { useRouter } from "expo-router"; // For navigation
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsOfServicePage: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-blue-600 text-2xl font-bold">{"<"}</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-800 mr-10">
          Terms of Service
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        <Text className="text-gray-800 text-base mb-6 leading-6">
          Welcome to [Your App Name]! These Terms of Service (&quot;Terms&quot;)
          govern your use of our mobile application and related services
          (collectively, the &quot;Service&quot;). By accessing or using the
          Service, you agree to be bound by these Terms. If you disagree with
          any part of the terms, then you may not access the Service.
        </Text>

        {/* Section: Acceptance of Terms */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          1. Acceptance of Terms
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          By creating an account or using the Service, you affirm that you are
          at least 18 years old and capable of entering into a binding contract.
          If you are accessing or using the Service on behalf of a company or
          other legal entity, you represent that you have the authority to bind
          such entity to these Terms.
        </Text>

        {/* Section: User Accounts */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          2. User Accounts
        </Text>
        <Text className="text-gray-700 text-base mb-2 leading-6">
          When you create an account with us, you must provide information that
          is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of your account on our Service.
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          You are responsible for safeguarding the password that you use to
          access the Service and for any activities or actions under your
          password. You agree not to disclose your password to any third party.
          You must notify us immediately upon becoming aware of any breach of
          security or unauthorized use of your account.
        </Text>

        {/* Section: Prohibited Conduct */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          3. Prohibited Conduct
        </Text>
        <Text className="text-gray-700 text-base mb-2 leading-6">
          You agree not to engage in any of the following prohibited activities:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-gray-700 text-base leading-6">
            • Using the Service for any illegal purpose or in violation of any
            local, state, national, or international law.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Impersonating any person or entity, or falsely stating or
            otherwise misrepresenting your affiliation with a person or entity.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Interfering with or disrupting the Service or servers or networks
            connected to the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Attempting to gain unauthorized access to any portion of the
            Service, other accounts, computer systems, or networks connected to
            the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Uploading or transmitting viruses or any other type of malicious
            code that will or may be used in any way that will affect the
            functionality or operation of the Service.
          </Text>
        </View>

        {/* Section: Intellectual Property */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          4. Intellectual Property
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          The Service and its original content (excluding content provided by
          users), features, and functionality are and will remain the exclusive
          property of [Your Company Name] and its licensors. The Service is
          protected by copyright, trademark, and other laws of both the [Your
          Country] and foreign countries. Our trademarks and trade dress may not
          be used in connection with any product or service without the prior
          written consent of [Your Company Name].
        </Text>

        {/* Section: Disclaimers */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          5. Disclaimers
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          Your use of the Service is at your sole risk. The Service is provided
          on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The
          Service is provided without warranties of any kind, whether express or
          implied, including, but not limited to, implied warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          or course of performance.
        </Text>

        {/* Section: Limitation of Liability */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          6. Limitation of Liability
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          In no event shall [Your Company Name], nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential, or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of
          or inability to access or use the Service; (ii) any conduct or content
          of any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use, or alteration of your
          transmissions or content, whether based on warranty, contract, tort
          (including negligence), or any other legal theory, whether or not we
          have been informed of the possibility of such damage, and even if a
          remedy set forth herein is found to have failed of its essential
          purpose.
        </Text>

        {/* Section: Indemnification */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          7. Indemnification
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          You agree to defend, indemnify, and hold harmless [Your Company Name]
          and its licensee and licensors, and their employees, contractors,
          agents, officers, and directors, from and against any and all claims,
          damages, obligations, losses, liabilities, costs or debt, and expenses
          (including but not limited to attorney&apos;s fees), resulting from or
          arising out of a) your use and access of the Service, by you or any
          person using your account and password; b) a breach of these Terms, or
          c) Content posted on the Service.
        </Text>

        {/* Section: Governing Law */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          8. Governing Law
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country], without regard to its conflict of law
          provisions. Our failure to enforce any right or provision of these
          Terms will not be considered a waiver of those rights. If any
          provision of these Terms is held to be invalid or unenforceable by a
          court, the remaining provisions of these Terms will remain in effect.
        </Text>

        {/* Section: Changes to Terms */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          9. Changes to Terms
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will provide at
          least 30 days&apos; notice prior to any new terms taking effect. What
          constitutes a material change will be determined at our sole
          discretion. By continuing to access or use our Service after those
          revisions become effective, you agree to be bound by the revised
          terms.
        </Text>

        {/* Section: Contact Us */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          10. Contact Us
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          If you have any questions about these Terms, please contact us at:
        </Text>
        <Text className="text-blue-600 text-base mb-4 leading-6 font-semibold">
          Email: support@yourappname.com
        </Text>
        <Text className="text-gray-700 text-base mb-6 leading-6">
          Address: Ekiti, Nigeria
        </Text>

        <Text className="text-gray-600 text-sm italic text-center mt-5">
          Last updated: July 10, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServicePage;
