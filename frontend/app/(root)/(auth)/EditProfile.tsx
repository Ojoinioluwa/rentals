// pages/edit-profile.tsx (or wherever you prefer to put your page components)

import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image, // Needed for profile picture display
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // Import Toast

// Assuming these are from your user services
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useMutation } from '@tanstack/react-query';
// import { updateProfileAPI, fetchUserProfileAPI } from '../../services/user/userServices';

const EditProfile: React.FC = () => {
  const router = useRouter();
  // const queryClient = useQueryClient(); // For invalidating user profile query

  useEffect(() => {
    // Show the "Feature Coming Soon" toast when the component mounts
    Toast.show({
      type: "info",
      text1: "Edit Profile Coming Soon!",
      text2: "This feature is under active development.",
      position: "top",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  }, []);

  /*
   * --- START OF COMMENTED-OUT LOGIC FOR EDIT PROFILE ---
   */

  // // Define a validation schema for the form using Yup
  // const validationSchema = Yup.object({
  //   firstName: Yup.string().required('First Name is required'),
  //   lastName: Yup.string().required('Last Name is required'),
  //   phoneNumber: Yup.string()
  //     .matches(/^\d{11}$/, 'Phone number must be exactly 11 digits') // Example for Nigerian numbers
  //     .required('Phone Number is required'),
  //   // Add validation for other fields if they become editable
  // });

  // // Simulate fetching initial user data for the form
  // // In a real app, you'd use useQuery here to get the existing user data
  // // For now, we'll use a placeholder
  // const initialUserData = {
  //   firstName: 'CurrentFirstName',
  //   lastName: 'CurrentLastName',
  //   email: 'current.email@example.com', // Email might not be editable
  //   phoneNumber: '08012345678',
  //   profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  // };

  // // Use useMutation for submitting profile updates
  // // const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
  // //   mutationFn: updateProfileAPI, // Your actual API call for updating profile
  // //   onSuccess: (data) => {
  // //     Toast.show({
  // //       type: 'success',
  // //       text1: 'Profile Updated!',
  // //       text2: 'Your profile has been successfully updated.',
  // //     });
  // //     queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // Invalidate and refetch user data on success
  // //     router.back(); // Go back to profile page
  // //   },
  // //   onError: (error) => {
  // //     Toast.show({
  // //       type: 'error',
  // //       text1: 'Update Failed!',
  // //       text2: error.message || 'Could not update profile. Please try again.',
  // //     });
  // //     console.error('Profile update error:', error);
  // //   },
  // // });

  // // const formik = useFormik({
  // //   initialValues: initialUserData, // Populate form with existing data
  // //   validationSchema,
  // //   onSubmit: async (values) => {
  // //     console.log('Attempting to update profile with:', values);
  // //     // await updateProfile(values); // Call your mutation
  // //     // Simulate update
  // //     Toast.show({
  // //       type: 'success',
  // //       text1: 'Profile Updated! (Simulated)',
  // //       text2: 'This is a simulated update success.',
  // //     });
  // //     router.back();
  // //   },
  // // });

  /*
   * --- END OF COMMENTED-OUT LOGIC FOR EDIT PROFILE ---
   */

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
          <View className="flex-1 p-5 items-center justify-center">
            <View className="h-4" />
            {/* Centering content for "coming soon" */}
            <View className="bg-white rounded-xl p-8 shadow-lg items-center max-w-sm w-full">
              <Text className="text-3xl font-bold text-blue-700 mb-4 text-center">
                Edit Profile
              </Text>
              <Text className="text-gray-600 text-base mb-8 text-center">
                This feature is currently under construction. We&apos;re working
                hard to bring you the best experience!
              </Text>

              {/* Display a placeholder for the profile picture */}
              <View className="w-28 h-28 rounded-full bg-gray-200 border-4 border-blue-300 items-center justify-center mb-6">
                <Image
                  source={{
                    uri: "https://via.placeholder.com/150/9CA3AF/FFFFFF?text=P.P",
                  }} // Placeholder for profile pic
                  className="w-24 h-24 rounded-full resize-cover"
                />
              </View>

              {/* --- START OF COMMENTED-OUT FORM --- */}
              {/*
              <View className="w-full mb-6">
                <FormInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formik.values.firstName}
                  onChangeText={formik.handleChange('firstName')}
                  onBlur={formik.handleBlur('firstName')}
                  error={formik.errors.firstName}
                  touched={formik.touched.firstName}
                  editable={!isUpdating}
                />
                <FormInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formik.values.lastName}
                  onChangeText={formik.handleChange('lastName')}
                  onBlur={formik.handleBlur('lastName')}
                  error={formik.errors.lastName}
                  touched={formik.touched.lastName}
                  editable={!isUpdating}
                />
                <FormInput
                  label="Email"
                  placeholder="Your email address"
                  value={formik.values.email}
                  keyboardType="email-address"
                  editable={false} // Email typically not editable
                />
                <FormInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formik.values.phoneNumber}
                  onChangeText={formik.handleChange('phoneNumber')}
                  onBlur={formik.handleBlur('phoneNumber')}
                  error={formik.errors.phoneNumber}
                  touched={formik.touched.phoneNumber}
                  keyboardType="phone-pad"
                  editable={!isUpdating}
                />
                // Add more fields as needed, e.g., userType (if editable), address, etc.
              </View>

              <ButtonUI
                isPending={isUpdating}
                name="Save Changes"
                onPress={formik.handleSubmit}
              />
              */}
              {/* --- END OF COMMENTED-OUT FORM --- */}

              {/* Go Back Button (always visible) */}
              <TouchableOpacity
                className="bg-blue-600 py-3 px-6 rounded-lg shadow-md mt-6"
                onPress={() => router.back()}
              >
                <Text className="text-white text-lg font-semibold">
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
