import { useRouter } from "expo-router"; // For navigation if needed
import React from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const IconPlaceholder = ({ name }: { name: string }) => (
  <Text className="text-blue-500 text-2xl mr-3">{name}</Text>
);

const HelpSupportPage: React.FC = () => {
  const router = useRouter();

  // Dummy FAQ Data (can be fetched from an API in a real app)
  const faqs = [
    {
      id: "1",
      question: "How do I search for properties?",
      answer:
        "You can search for properties using the search bar on the home screen. Filter by location, price range, property type, and more.",
    },
    {
      id: "2",
      question: "How do I contact a landlord?",
      answer:
        "Once you find a property you're interested in, tap on it to view details. You'll find contact options (like a message button or phone number) listed there.",
    },
    {
      id: "3",
      question: "What if I forget my password?",
      answer:
        'On the login screen, tap "Forgot Password?" and follow the instructions to reset it via your registered email address.',
    },
    {
      id: "4",
      question: "How do I list my property as a landlord?",
      answer:
        'If you have a landlord account, navigate to the "My Properties" section and tap "Add New Property" to begin listing. Make sure your account is verified.',
    },
    {
      id: "5",
      question: "Is my personal data secure?",
      answer:
        "Yes, we prioritize your data security. All sensitive information is encrypted, and we adhere to strict privacy policies. Please refer to our Privacy Policy for details.",
    },
  ];

  // Dummy contact methods
  const contactMethods = [
    {
      id: "email",
      label: "Email Us",
      icon: "✉️",
      action: () => Linking.openURL("mailto:Olabodexalabi@gmail.com"),
      description: "Get in touch via email for detailed inquiries.",
    },
    {
      id: "call",
      label: "Call Support",
      icon: "📞",
      action: () => Linking.openURL("tel:+2348034099796"), // Example Nigerian number
      description:
        "Speak directly with our support team during business hours.",
    },
    {
      id: "whatsapp",
      label: "Chat on WhatsApp",
      icon: "💬",
      action: () => Linking.openURL("https://wa.me/2348034099796"), // Example Nigerian number
      description: "Quick chat support for general questions.",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="flex-row items-center p-4 bg-white border-b border-gray-200 shadow-sm">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-blue-600 text-2xl font-bold">{"<"}</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-2xl font-bold text-gray-800 mr-10">
            Help & Support
          </Text>
        </View>

        {/* Search Bar Section */}
        {/* <View className="p-5 bg-white mb-5 shadow-sm">
          <Text className="text-xl font-semibold text-gray-800 mb-4 text-center">
            How can we help you?
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
            <IconPlaceholder name="🔍" />
            <TextInput
              className="flex-1 text-base text-gray-700"
              placeholder="Search FAQs, articles..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View> */}

        {/* FAQ Section */}
        <View className="bg-white rounded-xl mx-4 mb-5 p-5 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Frequently Asked Questions
          </Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              className="py-3 border-b border-gray-100 last:border-b-0"
            >
              <Text className="text-lg font-semibold text-gray-700 mb-1">
                {faq.question}
              </Text>
              <Text className="text-gray-600 text-base leading-6">
                {faq.answer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Us Section */}
        <View className="bg-white rounded-xl mx-4 mb-5 p-5 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Contact Us
          </Text>
          <Text className="text-gray-600 text-base mb-4">
            Can&apos;t find what you&apos;re looking for? Reach out to our
            support team.
          </Text>
          {contactMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className="flex-row items-center bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3"
              onPress={method.action}
            >
              <IconPlaceholder name={method.icon} />
              <View className="flex-1">
                <Text className="text-blue-700 text-lg font-bold">
                  {method.label}
                </Text>
                <Text className="text-blue-500 text-sm mt-1">
                  {method.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-xl font-bold ml-3">
                {">"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal/Info Section (Optional but common) */}
        <View className="mx-4 mt-5 items-center">
          <Text className="text-gray-500 text-sm mb-2">App Version 1.0.0</Text>
          <TouchableOpacity onPress={() => router.push("/law/TermsOfService")}>
            <Text className="text-blue-600 text-sm mb-1">Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/law/PrivacyPolicy")}>
            <Text className="text-blue-600 text-sm">Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportPage;
