import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

export default function PostFormScreen() {
  const { id, userId, title: qTitle, body: qBody } = useLocalSearchParams();
  const [title, setTitle] = useState(qTitle || '');
  const [body, setBody] = useState(qBody || '');
  const isEdit = !!id;

  const savePost = async () => {
    const saved = await AsyncStorage.getItem('posts');
    const all = saved ? JSON.parse(saved) : [];

    if (isEdit) {
      const updated = all.map((p) =>
        p.id == id ? { ...p, title, body } : p
      );
      await AsyncStorage.setItem('posts', JSON.stringify(updated));
    } else {
      const newPost = {
        id: Date.now(),
        userId: Number(userId),
        title,
        body,
      };
      await AsyncStorage.setItem('posts', JSON.stringify([newPost, ...all]));
    }

    router.back();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 16 }}>
        {isEdit ? 'Edit Post' : 'New Post'}
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={setBody}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          minHeight: 120,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={savePost}
        style={{
          backgroundColor: '#ff0000ff',
          padding: 12,
          borderRadius: 8,
        }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          {isEdit ? 'Save' : 'Create'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
