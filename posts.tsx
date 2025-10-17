import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router } from 'expo-router';

export default function PostListScreen() {
  const { userId, userName } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const saved = await AsyncStorage.getItem('posts');
    const all = saved ? JSON.parse(saved) : [];
    const userPosts = all.filter((p) => p.userId == userId);
    setPosts(userPosts);
  };

  const deletePost = async (id) => {
    const saved = await AsyncStorage.getItem('posts');
    const all = saved ? JSON.parse(saved) : [];
    const updated = all.filter((p) => p.id !== id);
    await AsyncStorage.setItem('posts', JSON.stringify(updated));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 10 }}>
        {userName ? `${userName}'s Posts` : 'Posts'}
      </Text>

      <TouchableOpacity
        onPress={() => router.push({ pathname: '/post-form', params: { userId } })}
        style={{
          backgroundColor: '#333',
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>New Post</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#f3f3f3',
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() =>
                router.push({ pathname: '/post-detail', params: { id: item.id } })
              }>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
              <Text numberOfLines={2}>{item.body}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/post-form',
                    params: { id: item.id, title: item.title, body: item.body, userId },
                  })
                }
                style={{ backgroundColor: '#555', padding: 8, borderRadius: 6 }}>
                <Text style={{ color: 'white' }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deletePost(item.id)}
                style={{ backgroundColor: '#C00', padding: 8, borderRadius: 6 }}>
                <Text style={{ color: 'white' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
