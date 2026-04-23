import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

/**
 * Placeholder da tela Hoje. Apenas prova que o login funciona e a
 * navegação pós-auth está ok. Portar funcionalidade real no próximo
 * ciclo, depois do spike validado.
 */
export default function Hoje() {
  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/(auth)/login')
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="px-6 py-10 gap-8">
        <View>
          <Text className="font-mono text-[10px] uppercase tracking-[2.2px] text-ink-faint">
            I · spike
          </Text>
          <Text className="font-serif text-5xl text-ink mt-2">Hoje</Text>
        </View>

        <View className="bg-surface border border-hairline rounded-2xl p-5 gap-3">
          <Text className="font-mono text-[10px] uppercase tracking-[2.2px] text-ink-faint">
            Placeholder
          </Text>
          <Text className="font-serif text-xl text-ink leading-snug">
            Você acabou de entrar em Kairos nativo.
          </Text>
          <Text className="text-[15px] text-ink-muted leading-relaxed">
            Esta tela existe só para provar o fluxo de auth e o design system no iOS.
            As telas de verdade (tarefas, timer, diário) são portadas a seguir se este
            spike te convencer.
          </Text>
        </View>

        <Pressable
          onPress={handleSignOut}
          className="rounded-full py-3 items-center border border-hairline"
        >
          <Text className="text-sm text-ink-muted">Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
