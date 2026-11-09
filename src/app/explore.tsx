
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const [ime, setIme] = useState('');
const [predmet, setPredmet] = useState('');
const [rok, setRok] = useState('');
const shraniNalogo = async () => {
  if (!ime.trim() || !predmet.trim() || !rok.trim()) {
    alert('Izpolni vsa polja!');
    return;
  }

  const novaNaloga = {
    id: Date.now().toString(),
    ime: ime.trim(),
    predmet: predmet.trim(),
    rok: rok.trim(),
    opravljeno: false,
  };

  try {
    const podatki = await AsyncStorage.getItem('naloge');
    const naloge = podatki ? JSON.parse(podatki) : [];

    naloge.push(novaNaloga);

    await AsyncStorage.setItem('naloge', JSON.stringify(naloge));

    setIme('');
    setPredmet('');
    setRok('');

    alert('Naloga je dodana!');
  } catch (error) {
    alert('Napaka pri shranjevanju naloge.');
  }
};
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Dodaj nalogo</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Tukaj lahko dodajaš naloge, ki jih moraš opraviti. Ko jih boš dodal, se bodo prikazale na domači strani.
          </ThemedText>
          </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <ThemedText type="subtitle">Nova naloga</ThemedText>
          <TextInput
  style={styles.input}
  placeholder="Ime naloge"
  value={ime}
  onChangeText={setIme}
/>
         <TextInput
         style={styles.input}
         placeholder="Predmet"
         value={predmet}
         onChangeText={setPredmet}
          />
            <ThemedText type="subtitle">
  Rok oddaje
</ThemedText>

<TextInput
  style={styles.input}
  placeholder="DD.MM.LLLL"
  value={rok}
onChangeText={setRok}
  keyboardType="numbers-and-punctuation"
/>
<Pressable style={styles.addButton} onPress={shraniNalogo}>
  <ThemedText style={styles.buttonText}>
    Dodaj nalogo
  </ThemedText>
</Pressable>
</ThemedView>
</ThemedView>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  input: {
  backgroundColor: '#ffffff',
  color: '#222222',
  borderWidth: 1,
  borderColor: '#dddddd',
  borderRadius: 10,
  padding: 15,
  fontSize: 16,
  width: '100%',
},
addButton: {
  backgroundColor: '#3563e9',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 15,
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});
