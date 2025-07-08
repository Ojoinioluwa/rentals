import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
interface Notification {
  id: string
  title: string
  pet: { name: string; image: string }
  date: string
  type: string
  description: string
}




const NotificationCard = ({id, title, pet, date, type, description}: Notification) => {
  return (
    <TouchableOpacity activeOpacity={0.7} className='bg-white rounded-lg mb-3 shadow-lg mr-4 w-full p-4' key={id}>
        <Text className='text-blue-950 text-xl font-rubix-medium'>{title} </Text>
        <View className='flex gap-2 items-start justify-between py-4'>
            <View className='flex-row gap-2 items-center'>
                <Image source={{uri: pet.image}} resizeMode='cover'  className='w-10 h-10 rounded-full'/>
                <Text className='text-blue-950 text-base font-rubix-semibold'>{pet.name}</Text>
            </View>
            <Text className='text-gray-500 text-lg font-rubix-light'>{date}</Text>
            <Text className='text-gray-500 text-lg font-rubix-light'>Type: {type}</Text>
        </View>
        <Text className='text-gray-500 text-lg font-rubix-light'>{description}</Text>
    </TouchableOpacity>
  )
}

export default NotificationCard