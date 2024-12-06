## Pokaz możliwości TensorFlowJS
### Aplikacja w stylu [__NVIDIA Canvas__](https://www.nvidia.com/en-us/studio/canvas/)

<video src="https://github.com/user-attachments/assets/d87ecc1d-c97e-4238-b705-cb82e037df97" width="600"></video>
<br/>

[__Link do aplikacji__](https://adriankucharski.github.io/gaugan-next-tensorflowjs/)

### Aplikacja wykorzystująca model językowy

![chat](https://github.com/user-attachments/assets/2098e5c6-c74a-4569-86d2-2b9de48903be)

## Wprowadzenie
Celem tego poradnika jest wprowadzenie do biblioteki TensorFlowJS. Biblioteka ta to potężne narzędzie, które pozwala na tworzenie lub wykorzystywanie modeli uczenia maszynowego bezpośrednio w przeglądarce użytkownika, bez konieczności korzystania z serwera. Dzięki połączeniu TensorFlowJS z Reactem, możliwe jest utworzenie interaktywnej aplikacji w przeglądarce, która będzie działać na wielu urządzeniach. 

## Wymagania
- MacOS
- Windows 10/11 + WSL2
- Linux
- Karta graficzna NVIDIA (opcjonalnie)

## Spis treści
### Keras
1. [Warstwy i modele](keras-tutorial/1.%20Warstwy%20i%20modele.ipynb)
2. [API funkcjonalne](keras-tutorial/2.%20API%20funkcjonalne.ipynb)
3. [Funkcje strat i optymalizatory](keras-tutorial/3.%20Funkcje%20strat%20i%20optymalizatory.ipynb)
4. [Przetwarzanie tekstu](keras-tutorial/4.%20Przetwarzanie%20tekstu.ipynb)
5. [Numpy i keras.ops](keras-tutorial/5.%20Numpy%20i%20keras.ops.ipynb)
6. [__Własne warstwy__](keras-tutorial/6.%20Własne%20warstwy.ipynb)

### TensorFlow
1. [TensorFlow w warstwach Kerasa](tensorflow-tutorial/1.%20TensorFlow%20w%20warstwach%20Kerasa.ipynb)
2. [__GradientTape w TensorFlow__](tensorflow-tutorial/2.%20GradientTape%20w%20TensorFlow.ipynb)
3. [Niestandardowa pętla uczenia](tensorflow-tutorial/3.%20Niestandardowa%20pętla%20uczenia.ipynb)

### TensorFlowJS
1. [Zapis modelu w TensorFlow i Keras](tensorflowjs-tutorial/1.%20Zapis%20modelu%20w%20TensorFlow%20i%20Keras.ipynb)
2. [__Konwersja modelu__](tensorflowjs-tutorial/2.%20Konwersja%20modelu.ipynb)
3. [Baza gotowych modeli i przykładów](https://www.tensorflow.org/js/models)

## Instalacja Keras, TensorFlow i TensorFlowJS w Pythonie
Pierwszym krokiem jest utworzenie środowiska w `Conda`, które pozwoli nam korzystać z biblitek Keras, TensorFlow i TensorFlowJS. W tym celu należy:
1. Pobrać i zainstalować Conda z oficjalnej strony: https://docs.conda.io/projects/conda/en/latest/user-guide/getting-started.html
2. Otworzyć terminal i przejść do katalogu z plikiem `environment.yml`
3. W terminalu wpisać komendę:
```bash
conda env create -f environment.yml
```

## Tworzenie aplikacji w React (z TypeScript) od podstaw
Pierwszy krok to pobranie `Node.js` i menadżera pakietów `npm`. W kolejnych krokach należy zainstalować `React` i `TypeScript`:
1. Pobrać i zainstalować Node.js z oficjalnej strony: https://nodejs.org/en/download/package-manager (zalecam wersję z `nvm`)
2. Zweryfikować instalację `Node.js`, `npm` i `npx`:
```bash
node -v # powinno zwrócić wersję Node.js
npm -v # powinno zwrócić wersję npm
npx -v # powinno zwrócić wersję npx
```
3. Utworzyć nowy projekt Reacta z TypeScriptem (https://react.dev/learn/start-a-new-react-project):
```bash
npx create-next-app@latest
# ✔ What is your project named? … llm-tfjs-app
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like your code inside a `src/` directory? … Yes
# ✔ Would you like to use App Router? (recommended) … Yes
# ✔ Would you like to use Turbopack for next dev? … No
# ✔ Would you like to customize the import alias (@/* by default)? … No
```
4. Przejść do katalogu z projektem:
```bash
cd llm-tfjs-app
```
5. Zainstalować bibliotekę TensorFlowJS:
```bash
npm install @tensorflow/tfjs
```
6. Uruchomić projekt. Instrukcja znajduje się w pliku `llm-tfjs-app/README.md`. Zazwyczaj wystarczy uruchomić aplikacje za pomocą skryptu:
```bash
npm run dev
```




## Linki
1. [Strona domowa TensorFlowJS](https://www.tensorflow.org/js)
2. [Repozytorium TensorFlowJS na GitHubie](https://github.com/tensorflow/tfjs)
3. [Dokumentacja TensorFlowJS](https://js.tensorflow.org/api/latest/)
4. [Dokumentacja Kerasa](https://keras.io/api/)
5. [Dokumentacja TensorFlow](https://www.tensorflow.org/api_docs/python/tf)
3. [Baza gotowych modeli TensorFlow.js](https://www.tensorflow.org/js/models)


## Autor
- Adrian Kucharski 2024