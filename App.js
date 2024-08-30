import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, FlatList, Image } from 'react-native-web';

export default function App() {
  const [superheroes, setSuperheroes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuperheroes = async () => {
    setLoading(true);
    try {
      const characters = ['batman', 'superman', 'wonder%20woman', 'flash']; 
      const requests = characters.map(character =>
        fetch(`https://www.superheroapi.com/api.php/ce900674922986a98bfcf3ec3bd2dbf0/search/${character}`)
          .then(response => response.json())
      );

      const results = await Promise.all(requests);
      const allSuperheroes = results.flatMap(result => result.results);
      setSuperheroes(allSuperheroes);
    } catch (error) {
      console.error('Error fetching superheroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image.url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.alias}>{item.biography['full-name']}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button onPress={fetchSuperheroes} title='Llamar API' />
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={superheroes}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alias: {
    fontSize: 14,
    color: '#666',
  },
});
