import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Surface, Text } from "react-native-paper";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  
  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      
      fetchHabits();

      return () => {
        habitsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {" "}
          Today's Habits
        </Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
          Sign Out
        </Button>
      </View>
      {habits?.length === 0 ? (
        <View style={styles.emptyState}> 
          <Text style={styles.emptyStateText}>No habits found. Add a habit to get started.</Text>
        </View>
      ) : (
        habits.map((habit, key) => (
          <Surface key={key} style={styles.card} elevation={0}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardDescription}>{habit.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons 
                  name="fire" 
                  size={18} 
                  color="#ff9800" 
                  />
                <Text style={styles.streakText}>
                  {habit.streak_count} days in a row
                </Text>
              </View>
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>
                  {habit.frequency.charAt(0).toUpperCase() + 
                  habit.frequency.slice(1)}
                </Text>
              </View>
              </View>
            </View>
          </Surface>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title:{
    fontSize: 24,
    fontWeight: "bold",
  },
  card:{
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent:{
    padding: 20,
  },
  cardTitle:{
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription:{
    fontSize: 14,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal:10,
    paddingVertical: 4,
  },
  streakText:{
    fontSize: 14,
    marginLeft: 8,
    color: "#ff9800",
    fontWeight: "bold",
  },
  frequencyBadge:{
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal:12,
    paddingVertical: 4,
  },
  frequencyText:{
    fontSize: 14,
    color: "#7c4dff",
    fontWeight: "bold",
  },
  emptyState:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText:{
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  }

})