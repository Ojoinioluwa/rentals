import { useRouter } from "expo-router"; // For navigation
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicyPage: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-blue-600 text-2xl font-bold">{"<"}</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-bold text-gray-800 mr-10">
          Privacy Policy
        </Text>
      </View>

      <ScrollView className="flex-1 p-5">
        <Text className="text-gray-800 text-base mb-6 leading-6">
          Your privacy is important to us. This Privacy Policy explains how
          [Your Company Name] (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) collects, uses, discloses, and safeguards your
          information when you use our mobile application [Your App Name] (the
          &quot;Service&quot;). Please read this Privacy Policy carefully. If
          you do not agree with the terms of this Privacy Policy, please do not
          access the Service.
        </Text>

        {/* Section: Information We Collect */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          1. Information We Collect
        </Text>
        <Text className="text-gray-700 text-base mb-2 leading-6">
          We may collect information about you in a variety of ways. The
          information we may collect via the Service depends on the content and
          materials you use, and includes:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Personal Data:</Text> Personally
            identifiable information, such as your name, shipping address, email
            address, and telephone number, and demographic information, such as
            your age, gender, hometown, and interests, that you voluntarily give
            to us when you register with the Service or when you choose to
            participate in various activities related to the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Derivative Data:</Text>{" "}
            Information our servers automatically collect when you access the
            Service, such as your IP address, your browser type, your operating
            system, your access times, and the pages you have viewed directly
            before and after accessing the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Financial Data:</Text> Financial
            information, such as data related to your payment method (e.g.,
            valid credit card number, card brand, expiration date) that we may
            collect when you purchase, order, return, exchange, or request
            information about our services from the Service. We store only very
            limited, if any, financial information that we collect. Otherwise,
            all financial information is stored by our payment processor,
            [Payment Processor Name], and you are encouraged to review their
            privacy policy.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Mobile Device Access:</Text> We
            may request access or permission to certain features from your
            mobile device, including your mobile device’s [e.g., camera,
            contacts, location, microphone, storage]. If you wish to change our
            access or permissions, you may do so in your device’s settings.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Push Notifications:</Text> We may
            request to send you push notifications regarding your account or the
            Service. If you wish to opt-out from receiving these types of
            communications, you may turn them off in your device’s settings.
          </Text>
        </View>

        {/* Section: How We Use Your Information */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          2. How We Use Your Information
        </Text>
        <Text className="text-gray-700 text-base mb-2 leading-6">
          Having accurate information about you permits us to provide you with a
          smooth, efficient, and customized experience. Specifically, we may use
          information collected about you via the Service to:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-gray-700 text-base leading-6">
            • Create and manage your account.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Deliver targeted advertising, coupons, newsletters, and other
            information regarding promotions and the Service to you.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Email you regarding your account or order.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Enable user-to-user communications.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Fulfill and manage purchases, orders, payments, and other
            transactions related to the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Generate a personal profile about you to make your visit to the
            Service more personalized.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Increase the efficiency and operation of the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Monitor and analyze usage and trends to improve your experience
            with the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Notify you of updates to the Service.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • Perform other business activities as needed.
          </Text>
        </View>

        {/* Section: Disclosure of Your Information */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          3. Disclosure of Your Information
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          We may share information we have collected about you in certain
          situations. Your information may be disclosed as follows:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-gray-700 text-base leading-6">
            •{" "}
            <Text className="font-semibold">By Law or to Protect Rights:</Text>{" "}
            If we believe the release of information about you is necessary to
            respond to legal process, to investigate or remedy potential
            violations of our policies, or to protect the rights, property, and
            safety of others, we may share your information as permitted or
            required by any applicable law, rule, or regulation.
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            •{" "}
            <Text className="font-semibold">
              Third-Party Service Providers:
            </Text>{" "}
            We may share your information with third parties that perform
            services for us or on our behalf, including payment processing, data
            analysis, email delivery, hosting services, customer service, and
            marketing assistance.{" "}
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            • <Text className="font-semibold">Marketing Communications:</Text>{" "}
            With your consent, or with an opportunity for you to withdraw
            consent, we may share your information with third parties for
            marketing purposes, as permitted by law.
          </Text>
        </View>

        {/* Section: Security of Your Information */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          4. Security of Your Information
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable, and no method of data transmission can be guaranteed
          against any interception or other type of misuse.
        </Text>

        {/* Section: Policy for Children */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          5. Policy for Children
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          We do not knowingly solicit information from or market to children
          under the age of 13. If you become aware of any data we have collected
          from children under age 13, please contact us using the contact
          information provided below.
        </Text>

        {/* Section: Changes to This Privacy Policy */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          6. Changes to This Privacy Policy
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
          Changes to this Privacy Policy are effective when they are posted on
          this page.
        </Text>

        {/* Section: Contact Us */}
        <Text className="text-xl font-bold text-gray-800 mb-3">
          7. Contact Us
        </Text>
        <Text className="text-gray-700 text-base mb-4 leading-6">
          If you have any questions or comments about this Privacy Policy,
          please contact us at:
        </Text>
        <Text className="text-blue-600 text-base mb-4 leading-6 font-semibold">
          Email: support@gmail.com
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

export default PrivacyPolicyPage;
