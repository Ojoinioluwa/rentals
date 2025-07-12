import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { TextInput, Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { AnimatedView } from "@/app/(root)/LandlordComponents/UploadImages";
import { FadeInUp } from "react-native-reanimated";

interface Props {
  onLocationSelect: (location: {
    label: string;
    latitude: number;
    longitude: number;
  }) => void;
}

const GEOAPIFY_KEY = "d4d88a6869c243aeb1d563374f93385c";

export default function LocationSearchInput({ onLocationSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSelected, setHasSelected] = useState(false); // New state

  useEffect(() => {
    if (query.length < 3 || hasSelected) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 500); // debounce

    return () => clearTimeout(timeoutId);
  }, [query, hasSelected]);

  const fetchSuggestions = async (input: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        {
          params: {
            text: input,
            apiKey: GEOAPIFY_KEY,
            limit: 5,
            lang: "en",
            filter: "countrycode:ng",
          },
        }
      );
      setResults(res.data.features || []);
    } catch (err) {
      console.error("Geoapify autocomplete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    const { lat, lon } = item.properties;
    const label = item.properties.formatted;

    onLocationSelect({
      label,
      latitude: lat,
      longitude: lon,
    });

    setQuery(label);
    setResults([]);
    setHasSelected(true); // mark as selected
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    setHasSelected(false); // user typed again, allow suggestions to show
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TextInput
        label="Search location"
        value={query}
        onChangeText={handleInputChange}
        mode="outlined"
        right={loading ? <ActivityIndicator animating size="small" /> : null}
      />

      {results.length > 0 && !hasSelected && (
        <AnimatedView
          entering={FadeInUp.delay(500).duration(600)}
          className="bg-white p-4 rounded-xl shadow-md mb-4"
        >
          <View
            style={{
              maxHeight: 300,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 4,
              marginTop: 4,
            }}
          >
            {results.map((item, index) => (
              <TouchableOpacity
                key={`${item.properties.place_id.toString()} ${index}`}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: "#eee",
                  backgroundColor: "#fff",
                }}
                onPress={() => handleSelect(item)}
              >
                <Text>{item.properties.formatted}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </AnimatedView>
      )}
    </View>
  );
}
