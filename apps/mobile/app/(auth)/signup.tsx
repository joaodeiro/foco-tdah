import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { showError, showValidation } from '@/lib/toast'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (password.length < 8) {
      showValidation('Senha muito curta.', 'Precisa ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      showValidation('As senhas não coincidem.', 'Digite a mesma senha nos dois campos.')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        showError(error)
        return
      }
      if (data.session) {
        router.replace('/(app)/hoje')
      } else {
        showValidation('Confirme seu e-mail.', 'Enviamos um link para ativar a conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-stretch justify-center py-10 gap-10">
            <View className="items-center gap-2">
              <Text className="font-mono text-[10px] uppercase tracking-[2.2px] text-ink-faint">
                Kairos
              </Text>
              <Text className="font-serif-italic text-4xl text-ink">
                Crie sua conta.
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">E-mail</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="você@email.com"
                  placeholderTextColor="#8d7f68"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  className="bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink"
                />
              </View>

              <View className="gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">Senha</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="#8d7f68"
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="newPassword"
                  className="bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink"
                />
              </View>

              <View className="gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-[2.4px] text-ink-faint">Confirmar</Text>
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="Digite de novo"
                  placeholderTextColor="#8d7f68"
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="newPassword"
                  className="bg-surface border border-hairline rounded-xl px-4 py-3.5 text-base text-ink"
                />
              </View>

              <Pressable
                onPress={handleSignup}
                disabled={loading || !email || !password || !confirm}
                className={`rounded-full py-3.5 items-center ${loading || !email || !password || !confirm ? 'bg-ink/40' : 'bg-ink active:bg-terracotta'}`}
              >
                <Text className="text-background font-sans-semi text-[15px]">
                  {loading ? 'Criando…' : 'Criar conta'}
                </Text>
              </Pressable>

              <View className="flex-row justify-center items-center pt-2 gap-1.5">
                <Text className="text-sm text-ink-muted">Já tem conta?</Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text className="text-sm text-ink underline decoration-hairline">Entrar</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
