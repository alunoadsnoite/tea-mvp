// AsyncStorage em memória para testes: o mock oficial do pacote já cobre
// getItem/setItem/removeItem com um mapa descartável por arquivo de teste.
jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
