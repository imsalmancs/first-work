import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedPosts = await AsyncStorage.getItem('posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    const current = posts.find((p) => p.id == id);
    setPost(current);

    const savedComments = await AsyncStorage.getItem(`comments_${id}`);
    setComments(savedComments ? JSON.parse(savedComments) : []);
  };

  const handleSaveComment = async () => {
    if (!text.trim()) return;

    let updated;
    if (editId) {
      updated = comments.map((c) =>
        c.id === editId ? { ...c, body: text.trim() } : c
      );
    } else {
      const newComment = { id: Date.now(), name: 'You', body: text.trim() };
      updated = [newComment, ...comments];
    }

    setComments(updated);
    await AsyncStorage.setItem(`comments_${id}`, JSON.stringify(updated));

    setText('');
    setEditId(null);
    setModalVisible(false);
  };

  const handleDelete = async (cid) => {
    const updated = comments.filter((c) => c.id !== cid);
    setComments(updated);
    await AsyncStorage.setItem(`comments_${id}`, JSON.stringify(updated));
  };

  const handleEdit = (item) => {
    setText(item.body);
    setEditId(item.id);
    setModalVisible(true);
  };

  if (!post) return <Text style={{ margin: 20 }}>Post not found.</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>

      <Text style={{ fontSize: 22, fontWeight: '700' }}>{post.title}</Text>
      <Text style={{ marginBottom: 20 }}>{post.body}</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Comments</Text>

      {comments.length === 0 ? (
        <Text>No comments yet. Be the first one!</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(c) => c.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#f3f3f3',
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}>
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text>{item.body}</Text>

              <View style={{ flexDirection: 'row', marginTop: 6, gap: 10 }}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={{ backgroundColor: '#555', padding: 6, borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ backgroundColor: 'red', padding: 6, borderRadius: 5 }}>
                  <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          setEditId(null);
          setText('');
          setModalVisible(true);
        }} style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#353535ff', padding: 12, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ marginLeft: 8, color: '#ffffffff', }}>Add comment...</Text>
      </TouchableOpacity>


      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
            }}>
            <TextInput
              placeholder="Type your comment..."
              value={text}
              onChangeText={setText}
              multiline
              style={{
                height: 100,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                textAlignVertical: 'top',
              }}
            />

            <TouchableOpacity
              onPress={handleSaveComment}
              style={{
                backgroundColor: 'red',
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
              }}>
              <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
                {editId ? 'Save Changes' : 'Post Comment'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setText('');
                setEditId(null);
              }}
              style={{
                backgroundColor: '#ccc',
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
              }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
