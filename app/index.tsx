import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { colors } from "../src/constants/colors";
import {
  EmptyState,
  GlassCard,
  AppInput,
  InlineTextButton,
  PrimaryButton,
  SectionHeader,
} from "../src/components/ui";
import {
  mapAuthErrorMessage,
  validateEmail,
  validatePassword,
} from "../src/utils/auth";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  created_at?: string;
};

type AuthMode = "login" | "register";
type BusyAction = "add" | "save" | "delete" | "signout" | null;

export default function IndexScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setBootLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setBootLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (bootLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading workspace...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <NotesWorkspace userEmail={session.user.email ?? "User"} />;
}

function AuthScreen() {
  const params = useLocalSearchParams<{ message?: string }>();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isLogin = mode === "login";
  const showPasswordUpdatedMessage = params.message === "password-updated";

  async function handleAuth() {
    const emailCheck = validateEmail(email);
    const passwordCheck = validatePassword(password);

    setEmailError(emailCheck.message);
    setPasswordError(passwordCheck.message);
    setAuthError(null);

    if (!emailCheck.valid || !passwordCheck.valid) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setAuthError(mapAuthErrorMessage(error.message));
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setAuthError(mapAuthErrorMessage(error.message));
          return;
        }

        const needsEmailConfirmation = !data.session;
        Alert.alert(
          needsEmailConfirmation ? "Check your email" : "Account created",
          needsEmailConfirmation
            ? "Your account was created. Confirm your email address to continue."
            : "Your account was created successfully."
        );
      }
    } catch (error: any) {
      setAuthError(mapAuthErrorMessage(error?.message));
    } finally {
      setLoading(false);
    }
  }

  function handleSwitchMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setPassword("");
    setPasswordError(null);
    setAuthError(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.authScreen}>
        <View style={styles.authShell}>
          <View style={styles.authGrid}>
            <View style={styles.authBrandPanel}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>PREMIUM WORKSPACE</Text>
              </View>

              <View style={styles.brandIconWrap}>
                <Text style={styles.brandIcon}>✦</Text>
              </View>

              <Text style={styles.brandTitle}>Smart Notes AI</Text>
              <Text style={styles.brandSubtitle}>
                Private note taking with secure auth, smart tags, fast search,
                and a clean workspace built for real use.
              </Text>

              <View style={styles.brandFeatureList}>
                <View style={styles.brandFeatureItem}>
                  <View style={styles.brandFeatureDot} />
                  <Text style={styles.brandFeatureText}>
                    Secure personal workspace
                  </Text>
                </View>
                <View style={styles.brandFeatureItem}>
                  <View style={styles.brandFeatureDot} />
                  <Text style={styles.brandFeatureText}>
                    Smart AI-style tagging
                  </Text>
                </View>
                <View style={styles.brandFeatureItem}>
                  <View style={styles.brandFeatureDot} />
                  <Text style={styles.brandFeatureText}>
                    Fast filtering and search
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.authFormPanel}>
              <GlassCard style={styles.authCard}>
                <SectionHeader
                  title={isLogin ? "Welcome back" : "Create account"}
                  meta="SUPABASE AUTH"
                />

                {showPasswordUpdatedMessage && isLogin ? (
                  <View style={styles.successBanner}>
                    <Text style={styles.successBannerText}>
                      Password updated successfully. Please log in.
                    </Text>
                  </View>
                ) : null}

                {authError ? (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{authError}</Text>
                  </View>
                ) : null}

                <AppInput
                  placeholder="Email"
                  value={email}
                  onChangeText={(value: string) => {
                    setEmail(value);
                    if (emailError) setEmailError(null);
                    if (authError) setAuthError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={emailError}
                />

                <AppInput
                  placeholder={
                    isLogin
                      ? "Password"
                      : "Password (min 8 chars, letter + number)"
                  }
                  value={password}
                  onChangeText={(value: string) => {
                    setPassword(value);
                    if (passwordError) setPasswordError(null);
                    if (authError) setAuthError(null);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  textContentType={isLogin ? "password" : "newPassword"}
                  error={passwordError}
                />

                <PrimaryButton
                  label={isLogin ? "Sign in" : "Create account"}
                  loading={loading}
                  disabled={!email.trim() || !password.trim()}
                  onPress={handleAuth}
                />

                {isLogin ? (
                  <InlineTextButton
                    label="Forgot password?"
                    onPress={() => router.push("/forgot-password")}
                    disabled={loading}
                  />
                ) : null}

                <InlineTextButton
                  label={
                    isLogin
                      ? "Don’t have an account? Register"
                      : "Already have an account? Sign in"
                  }
                  onPress={handleSwitchMode}
                  disabled={loading}
                />
              </GlassCard>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function NotesWorkspace({ userEmail }: { userEmail: string }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1100;
  const isMedium = width >= 820;

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [busyDeleteId, setBusyDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [manualTags, setManualTags] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editManualTags, setEditManualTags] = useState("");

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Load failed", mapAuthErrorMessage(error.message));
      setNotes([]);
    } else {
      setNotes((data as Note[]) ?? []);
    }

    setLoading(false);
  }

  function normalizeTag(tag: string) {
    return tag.trim().toLowerCase();
  }

  function parseManualTags(input: string) {
    return input.split(",").map(normalizeTag).filter(Boolean);
  }

  function uniqueTags(tags: string[]) {
    return Array.from(new Set(tags));
  }

  function suggestTags(noteTitle: string, noteContent: string) {
    const text = `${noteTitle} ${noteContent}`.toLowerCase();
    const tags: string[] = [];

    if (
      ["exam", "study", "lesson", "school", "homework"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("school");
    }

    if (
      ["project", "build", "app", "feature", "code"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("project");
    }

    if (
      ["meeting", "call", "schedule", "agenda"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("meeting");
    }

    if (
      ["idea", "brainstorm", "plan", "concept"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("idea");
    }

    if (
      ["urgent", "asap", "important", "deadline"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("urgent");
    }

    if (
      ["work", "office", "client", "business"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("work");
    }

    if (
      ["buy", "shopping", "market", "purchase"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("shopping");
    }

    if (
      ["personal", "journal", "daily", "life"].some((value) =>
        text.includes(value)
      )
    ) {
      tags.push("personal");
    }

    return uniqueTags(tags);
  }

  async function addNote() {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing fields", "Please fill both title and content.");
      return;
    }

    setBusyAction("add");

    try {
      const autoTags = suggestTags(title, content);
      const extraTags = parseManualTags(manualTags);
      const finalTags = uniqueTags([...autoTags, ...extraTags]);

      const { error } = await supabase.from("notes").insert([
        {
          title: title.trim(),
          content: content.trim(),
          tags: finalTags,
        },
      ]);

      if (error) throw error;

      setTitle("");
      setContent("");
      setManualTags("");
      await loadNotes();
    } catch (error: any) {
      Alert.alert("Create failed", mapAuthErrorMessage(error?.message));
    } finally {
      setBusyAction(null);
    }
  }

  async function deleteNote(id: string) {
    setBusyDeleteId(id);

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        throw error;
      }

      if (editingId === id) {
        cancelEdit();
      }

      await loadNotes();
    } catch (error: any) {
      Alert.alert("Delete failed", mapAuthErrorMessage(error?.message));
    } finally {
      setBusyDeleteId(null);
    }
  }

  function confirmDelete(id: string) {
    if (Platform.OS === "web") {
      const confirmed = globalThis?.confirm?.(
        "Delete note? This note will be removed permanently."
      );

      if (confirmed) {
        void deleteNote(id);
      }

      return;
    }

    Alert.alert("Delete note", "This note will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void deleteNote(id);
        },
      },
    ]);
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditManualTags((note.tags ?? []).join(", "));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditManualTags("");
  }

  async function saveEdit() {
    if (!editingId) return;

    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert("Missing fields", "Please fill both title and content.");
      return;
    }

    setBusyAction("save");

    try {
      const autoTags = suggestTags(editTitle, editContent);
      const extraTags = parseManualTags(editManualTags);
      const finalTags = uniqueTags([...autoTags, ...extraTags]);

      const { error } = await supabase
        .from("notes")
        .update({
          title: editTitle.trim(),
          content: editContent.trim(),
          tags: finalTags,
        })
        .eq("id", editingId);

      if (error) throw error;

      cancelEdit();
      await loadNotes();
    } catch (error: any) {
      Alert.alert("Update failed", mapAuthErrorMessage(error?.message));
    } finally {
      setBusyAction(null);
    }
  }

  async function signOut() {
    setBusyAction("signout");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Sign out failed", mapAuthErrorMessage(error?.message));
    } finally {
      setBusyAction(null);
    }
  }

  const suggestedPreviewTags = useMemo(() => {
    const autoTags = suggestTags(title, content);
    const extraTags = parseManualTags(manualTags);
    return uniqueTags([...autoTags, ...extraTags]);
  }, [title, content, manualTags]);

  const allTags = useMemo(() => {
    const merged = notes.flatMap((note) => note.tags ?? []);
    return Array.from(new Set(merged)).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTag = activeTag ? (note.tags ?? []).includes(activeTag) : true;
      const query = searchText.trim().toLowerCase();

      const matchesSearch = query
        ? note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.tags ?? []).some((tag) => tag.toLowerCase().includes(query))
        : true;

      return matchesTag && matchesSearch;
    });
  }, [notes, activeTag, searchText]);

  const topSummary = [
    {
      label: "Total notes",
      value: String(notes.length),
      hint: "Private saved notes",
    },
    {
      label: "Filtered results",
      value: String(filteredNotes.length),
      hint: "Visible after search/filter",
    },
    {
      label: "Active tags",
      value: String(allTags.length),
      hint: "Detected + manual tags",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.workspacePage}
        ListHeaderComponent={
          <View style={styles.workspaceShell}>
            <View style={styles.workspaceHero}>
              <View style={styles.workspaceHeroLeft}>
                <Text style={styles.workspaceEyebrow}>PRIVATE KNOWLEDGE HUB</Text>
                <Text style={styles.workspaceTitle}>Your Smart Notes workspace</Text>
                <Text style={styles.workspaceSubtitle}>
                  Signed in as {userEmail}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={signOut}
                disabled={busyAction === "signout"}
                activeOpacity={0.9}
              >
                <Text style={styles.signOutButtonText}>
                  {busyAction === "signout" ? "Signing out..." : "Sign out"}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.summaryRow,
                !isMedium ? styles.summaryRowStack : undefined,
              ]}
            >
              {topSummary.map((item) => (
                <GlassCard
                  key={item.label}
                  style={[
                    styles.summaryCard,
                    !isMedium ? styles.summaryCardStack : undefined,
                  ]}
                >
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                  <Text style={styles.summaryHint}>{item.hint}</Text>
                </GlassCard>
              ))}
            </View>

            <View
              style={[
                styles.topGrid,
                !isWide ? styles.topGridStack : undefined,
              ]}
            >
              <GlassCard
                style={[
                  styles.createCard,
                  !isWide ? styles.fullWidthCard : undefined,
                ]}
              >
                <SectionHeader title="Create note" meta="AI TAGS READY" />

                <AppInput
                  placeholder="Title"
                  value={title}
                  onChangeText={setTitle}
                />

                <AppInput
                  placeholder="Content"
                  value={content}
                  onChangeText={setContent}
                  multiline
                />

                <AppInput
                  placeholder="Extra tags (comma separated)"
                  value={manualTags}
                  onChangeText={setManualTags}
                />

                {suggestedPreviewTags.length ? (
                  <View style={styles.previewTagsWrap}>
                    <Text style={styles.previewTagsLabel}>Suggested tags</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.tagsRow}
                    >
                      {suggestedPreviewTags.map((tag) => (
                        <View key={tag} style={styles.tagChip}>
                          <Text style={styles.tagChipText}>#{tag}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}

                <PrimaryButton
                  label="Add note"
                  loading={busyAction === "add"}
                  disabled={!title.trim() || !content.trim()}
                  onPress={addNote}
                />
              </GlassCard>

              <View
                style={[
                  styles.sideColumn,
                  !isWide ? styles.fullWidthCard : undefined,
                ]}
              >
                <GlassCard style={styles.searchCard}>
                  <SectionHeader title="Find notes" meta="SEARCH + FILTER" />

                  <AppInput
                    placeholder="Search by title, content, or tag"
                    value={searchText}
                    onChangeText={setSearchText}
                  />

                  {allTags.length ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.tagsRow}
                    >
                      <TouchableOpacity
                        onPress={() => setActiveTag(null)}
                        style={[
                          styles.filterChip,
                          !activeTag ? styles.filterChipActive : undefined,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            !activeTag
                              ? styles.filterChipTextActive
                              : undefined,
                          ]}
                        >
                          All
                        </Text>
                      </TouchableOpacity>

                      {allTags.map((tag) => {
                        const active = activeTag === tag;
                        return (
                          <TouchableOpacity
                            key={tag}
                            onPress={() => setActiveTag(active ? null : tag)}
                            style={[
                              styles.filterChip,
                              active ? styles.filterChipActive : undefined,
                            ]}
                          >
                            <Text
                              style={[
                                styles.filterChipText,
                                active
                                  ? styles.filterChipTextActive
                                  : undefined,
                              ]}
                            >
                              #{tag}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <Text style={styles.sideMutedText}>
                      Tags will appear here after you create notes.
                    </Text>
                  )}
                </GlassCard>

                <GlassCard style={styles.infoCard}>
                  <SectionHeader title="Notes overview" meta="QUICK STATUS" />
                  <Text style={styles.infoText}>
                    Keep titles short, write clear content, and use manual tags
                    only when needed. AI tag suggestions will combine with your
                    own custom tags automatically.
                  </Text>
                </GlassCard>
              </View>
            </View>

            <View style={styles.notesHeaderRow}>
              <View>
                <Text style={styles.notesSectionTitle}>Your notes</Text>
                <Text style={styles.notesSectionMeta}>
                  {filteredNotes.length} item
                  {filteredNotes.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isEditing = editingId === item.id;
          const isDeleting = busyDeleteId === item.id;

          return (
            <View style={styles.workspaceShell}>
              <GlassCard style={styles.noteCard}>
                {isEditing ? (
                  <>
                    <SectionHeader title="Edit note" meta="UPDATE MODE" />

                    <AppInput
                      placeholder="Title"
                      value={editTitle}
                      onChangeText={setEditTitle}
                    />

                    <AppInput
                      placeholder="Content"
                      value={editContent}
                      onChangeText={setEditContent}
                      multiline
                    />

                    <AppInput
                      placeholder="Tags (comma separated)"
                      value={editManualTags}
                      onChangeText={setEditManualTags}
                    />

                    <PrimaryButton
                      label="Save changes"
                      loading={busyAction === "save"}
                      disabled={!editTitle.trim() || !editContent.trim()}
                      onPress={saveEdit}
                    />

                    <InlineTextButton label="Cancel" onPress={cancelEdit} />
                  </>
                ) : (
                  <>
                    <View style={styles.noteTopRow}>
                      <View style={styles.noteTitleWrap}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <Text style={styles.noteContent}>{item.content}</Text>
                      </View>
                    </View>

                    {item.tags?.length ? (
                      <View style={styles.noteTagsWrap}>
                        {item.tags.map((tag) => (
                          <View key={`${item.id}-${tag}`} style={styles.noteTagChip}>
                            <Text style={styles.noteTagText}>#{tag}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        onPress={() => startEdit(item)}
                        style={styles.secondaryActionButton}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.secondaryActionText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => confirmDelete(item.id)}
                        style={[
                          styles.dangerActionButton,
                          isDeleting ? styles.disabledButton : undefined,
                        ]}
                        disabled={isDeleting}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.dangerActionText}>
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </GlassCard>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.workspaceShell}>
            {loading ? (
              <View style={styles.listLoadingWrap}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading notes...</Text>
              </View>
            ) : notes.length === 0 ? (
              <EmptyState
                title="No notes yet"
                subtitle="Create your first private note to start building your Smart Notes AI workspace."
              />
            ) : (
              <EmptyState
                title="No matching notes"
                subtitle="Try a different search or clear the active tag filter."
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  listLoadingWrap: {
    paddingVertical: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },

  authScreen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
  },
  authShell: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#f7faff",
    padding: 18,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  authGrid: {
    flexDirection: "row",
    gap: 18,
    alignItems: "stretch",
  },
  authBrandPanel: {
    flex: 1,
    minHeight: 520,
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 28,
    backgroundColor: "#eef4ff",
    borderWidth: 1,
    borderColor: "#d9e7ff",
    justifyContent: "center",
  },
  brandBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 18,
  },
  brandBadgeText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  brandIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    shadowColor: "#2563eb",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  brandIcon: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },
  brandTitle: {
    color: "#0f172a",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 46,
    marginBottom: 14,
  },
  brandSubtitle: {
    color: "#475569",
    fontSize: 17,
    lineHeight: 28,
    maxWidth: 520,
    marginBottom: 26,
  },
  brandFeatureList: {
    gap: 12,
  },
  brandFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandFeatureDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    marginRight: 12,
  },
  brandFeatureText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },
  authFormPanel: {
    width: 420,
    justifyContent: "center",
  },
  authCard: {
    marginBottom: 0,
    padding: 24,
    borderRadius: 28,
  },

  successBanner: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.successBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  successBannerText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },

  workspacePage: {
    paddingVertical: 18,
    paddingBottom: 42,
  },
  workspaceShell: {
    width: "100%",
    maxWidth: 1220,
    alignSelf: "center",
    paddingHorizontal: 18,
  },
  workspaceHero: {
    backgroundColor: "#eef4ff",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dbeafe",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  workspaceHeroLeft: {
    flex: 1,
  },
  workspaceEyebrow: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  workspaceTitle: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  workspaceSubtitle: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
  },
  signOutButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  signOutButtonText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 14,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  summaryRowStack: {
    flexDirection: "column",
  },
  summaryCard: {
    flex: 1,
    marginBottom: 0,
  },
  summaryCardStack: {
    width: "100%",
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  summaryValue: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 6,
  },
  summaryHint: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 20,
  },

  topGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
    alignItems: "stretch",
  },
  topGridStack: {
    flexDirection: "column",
  },
  createCard: {
    flex: 1.35,
    marginBottom: 0,
  },
  fullWidthCard: {
    width: "100%",
  },
  sideColumn: {
    flex: 0.9,
    gap: 16,
  },
  searchCard: {
    marginBottom: 0,
  },
  infoCard: {
    marginBottom: 0,
  },
  infoText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 24,
  },
  sideMutedText: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 22,
  },

  previewTagsWrap: {
    marginBottom: 12,
  },
  previewTagsLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  tagsRow: {
    gap: 8,
    paddingRight: 8,
  },
  tagChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagChipText: {
    color: colors.primaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: colors.white,
  },

  notesHeaderRow: {
    marginBottom: 6,
  },
  notesSectionTitle: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  notesSectionMeta: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },

  noteCard: {
    marginBottom: 14,
    borderRadius: 24,
  },
  noteTopRow: {
    marginBottom: 10,
  },
  noteTitleWrap: {
    flex: 1,
  },
  noteTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  noteContent: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
  },
  noteTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    marginTop: 4,
  },
  noteTagChip: {
    backgroundColor: "#f8fbff",
    borderColor: "#dbeafe",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  noteTagText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
  },
  noteActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  secondaryActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#eef4ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  secondaryActionText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 14,
  },
  dangerActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  dangerActionText: {
    color: "#e11d48",
    fontWeight: "700",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.65,
  },
});