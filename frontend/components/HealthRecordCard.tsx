import React from 'react';
import { Image, Text, View } from 'react-native';

interface Pet {
  name: string;
  image: string;
}

interface Props {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  veterinarian: string;
  cost: number;
  pet: Pet;
}

const HealthRecordCard = ({ id, type, title, description, date, veterinarian, cost, pet }: Props) => {
  const formattedDate = new Date(date).toLocaleDateString(); 
  const formattedCost = `₦${cost.toFixed(2)}`;

  return (
    <View className='bg-white rounded-lg mb-3 shadow-lg mr-4 w-full p-4'>
      <Text className='text-blue-950 text-xl font-rubix-medium'>{title} </Text>
      <View className='flex gap-2 items-start justify-between py-4'>
        <View className='flex-row gap-2 items-center'>
          <Image source={{uri: pet.image}} resizeMode='cover' className='w-10 h-10 rounded-full' />
          <Text className='text-blue-950 text-base font-rubix-semibold'>{pet.name}</Text>
        </View>
        <Text className='text-gray-500 text-lg font-rubix-light'>{formattedDate}</Text>
        <Text className='text-gray-500 text-lg font-rubix-light'>Type: {type}</Text>
        <Text className='text-gray-500 text-lg font-rubix-light'>Veterinarian: {veterinarian}</Text>
        <Text className='text-gray-500 text-lg font-rubix-light'>Cost: {formattedCost}</Text>
      </View>
      <Text className='text-gray-500 text-lg font-rubix-light'>{description}</Text>
    </View>
  );
};

export default HealthRecordCard;
