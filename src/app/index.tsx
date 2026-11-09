import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [naloge, setNaloge] = useState<any[]>([]);

  
const spremeniStatus = async (id: string) => {
  const noveNaloge = naloge.map((naloga) =>
    naloga.id === id
      ? { ...naloga, opravljeno: !naloga.opravljeno }
      : naloga
  );

  setNaloge(noveNaloge);
  await AsyncStorage.setItem('naloge', JSON.stringify(noveNaloge));
};

const izbrisiNalogo = async (id: string) => {
  const noveNaloge = naloge.filter((naloga) => naloga.id !== id);

  await AsyncStorage.setItem('naloge', JSON.stringify(noveNaloge));
  setNaloge(noveNaloge);
};

const jeZamujena = (naloga: any) => {
  if (naloga.opravljeno) return false;

  const [dan, mesec, leto] = naloga.rok.split('.').map(Number);
  const datumRoka = new Date(leto, mesec - 1, dan);
  datumRoka.setHours(23, 59, 59, 999);

  return new Date() > datumRoka;
};


useFocusEffect(
  useCallback(() => {
    const naloziNaloge = async () => {
      const podatki = await AsyncStorage.getItem('naloge');
      setNaloge(podatki ? JSON.parse(podatki) : []);
    };

    naloziNaloge();
  }, [])
);
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Moje šolske naloge
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
  <ThemedText type="subtitle">
    Moje naloge
  </ThemedText>
  {naloge.length === 0 && (
  <ThemedText>
    Trenutno nimaš dodanih nalog.
  </ThemedText>
)}
{naloge.filter((naloga) => !naloga.opravljeno && !jeZamujena(naloga)).map((naloga) => (
<Pressable
  key={naloga.id}
  style={styles.card}
  onPress={() => spremeniStatus(naloga.id)}
>
    <ThemedText type="subtitle">
      {naloga.ime}
    </ThemedText>
    <ThemedText>
      Predmet: {naloga.predmet}
    </ThemedText>
  <ThemedText>
    Rok: {naloga.rok}
  </ThemedText>
</Pressable>
))}
  <ThemedView style={styles.card}>
  <ThemedText type="subtitle">
    Za narediti
  </ThemedText>
  <ThemedText type="title">
   {naloge.filter((naloga) => !naloga.opravljeno && !jeZamujena(naloga)).length}
  </ThemedText>
</ThemedView>
</ThemedView>
<ThemedView style={styles.card}>
  <ThemedText type="subtitle">
    Opravljeno
  </ThemedText>
  <ThemedText type="title">
    {naloge.filter((naloga) => naloga.opravljeno).length}
  </ThemedText>
  
{naloge.filter((naloga) => naloga.opravljeno).map((naloga) => (
  <ThemedView key={naloga.id} style={styles.card}>
    <ThemedText type="subtitle">
      {naloga.ime}
    </ThemedText>

    <ThemedText>
      Predmet: {naloga.predmet}
    </ThemedText>

    <Pressable onPress={() => spremeniStatus(naloga.id)}>
      <ThemedText>Vrni med neopravljene</ThemedText>
    </Pressable>

    <Pressable onPress={() => izbrisiNalogo(naloga.id)}>
      <ThemedText style={{ color: 'red' }}>
        Izbriši
      </ThemedText>
    </Pressable>
  </ThemedView>
))}

</ThemedView>

<ThemedView style={styles.card}>
  <ThemedText type="subtitle">
    Zamujeno
  </ThemedText>
  <ThemedText type="title">
    {naloge.filter((naloga) => jeZamujena(naloga)).length}
  </ThemedText>
  
{naloge.filter((naloga) => jeZamujena(naloga)).map((naloga) => (
  <ThemedView key={naloga.id} style={styles.card}>
    <ThemedText type="subtitle">
      {naloga.ime}
    </ThemedText>

    <ThemedText>
      Predmet: {naloga.predmet}
    </ThemedText>

    <ThemedText>
      Rok: {naloga.rok}
    </ThemedText>

    <Pressable onPress={() => spremeniStatus(naloga.id)}>
      <ThemedText>Označi kot opravljeno</ThemedText>
    </Pressable>

    <Pressable onPress={() => izbrisiNalogo(naloga.id)}>
      <ThemedText style={{ color: 'red' }}>
        Izbriši
      </ThemedText>
    </Pressable>
  </ThemedView>
))}

</ThemedView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  card: {
  padding: 20,
  borderRadius: 12,
  marginTop: 15,
  alignItems: 'center',
},
});
