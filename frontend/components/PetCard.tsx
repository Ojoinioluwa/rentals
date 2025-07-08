import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type petProps = {
  petId: string;
  image: any;
  name: string;
  age: number;
  breed: string;
  species: string;
  width: string;
}

const PetCard = ({image, name, age, breed, species, width, petId}: petProps) => {

  return (
     <View className={`bg-white rounded-lg mb-5 shadow-lg mr-4 w-${width}  p-4`}>
      
          <Image source={{ uri: image }} className='w-full h-[200] rounded-xl'/>
          <View className='px-2 py-3'>
            <Text className='text-blue-950 text-2xl font-rubix-medium'>{name}</Text>
            <Text className='text-gray-500 text-lg font-rubix-light'>Age: {age} years</Text>
            <Text className='text-gray-500 text-lg font-rubix-light'>Breed: {breed}</Text>
            <Text className='text-gray-500 text-lg font-rubix-light'>Species: {species}</Text>
          </View>
          <TouchableOpacity onPress={()=> router.push({
            pathname: "/PetInfo",
            params: {
              id: petId
            }
          })}>
            <Text className='text-blue-950 text-lg font-rubix-medium text-center py-3'>View Details</Text>
          </TouchableOpacity>
        </View>
  )
}

export default PetCard