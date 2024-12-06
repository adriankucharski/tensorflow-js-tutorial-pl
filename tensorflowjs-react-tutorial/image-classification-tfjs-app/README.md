## Uruchamianie aplikacji

Pierwszy krok to pobranie `Node.js` i menadżera pakietów `npm`. W kolejnych krokach należy zainstalować `React` i `TypeScript`:
1. Pobrać i zainstalować Node.js z oficjalnej strony: https://nodejs.org/en/download/package-manager (zalecam wersję z `nvm`)
2. Zweryfikować instalację `Node.js`, `npm` i `npx`:
```bash
node -v # powinno zwrócić wersję Node.js
npm -v # powinno zwrócić wersję npm
npx -v # powinno zwrócić wersję npx
```
3. Przejść do katalogu z projektem:
```bash
cd llm-tfjs-app
```
4. Zainstalować potrzebne biblioteki:
```bash
npm install
```
5. Uruchomić projekt:
```bash
npm run dev
```
6. Projekt powinien być dostępny pod adresem [http://localhost:3000](http://localhost:3000)

## GH Pages

Aby opublikować aplikację, aby była dostępna w sieci, można skorzystać z darmowego hostingu GitHub Pages. W tym celu należy:
1. Utworzyć nowe repozytorium na GitHubie
2. Zainstalować `gh-pages`:
```bash
npm install gh-pages --save-dev
```
3. Dodać link do naszej strony w pliku `package.json`:
```json
"homepage": "https://{username}.github.io/{repo-name}"
```
4. Dodać skrypty do `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
}
```
5. Dodać "remote" do swojego repozytorium:
```bash
git remote add origin https://github.com/{username}/{repo-name}.git
```
6. Opublikować aplikację:
```bash
npm run deploy
```

## Przechowywanie modeli

Model trzeba udostępnić publicznie, aby użytkownik mógł go wczytać. Można do tego wykorzystać np.: [www.kaggle.com](https://www.kaggle.com/models).

Model z kaggle można wczytać za pomocą tego kodu (jest to mój model, więc kod powinien działać):
```typescript
const [model, setModel] = React.useState<tf.GraphModel | null>(null);
const [loadedFraction, setLoadedFraction] = React.useState(0);
useEffect(() => {
  tf.setBackend('webgl'); // tf.setBackend('cpu');
  tf.enableProdMode(); // tf.enableDebugMode();

  tf.ready().then(() => {
    const modelLoader = async () => {
      try {
        const modelUrl =
          'https://www.kaggle.com/api/v1/models/kucharskiadrian/gaugan-next-tfjs/tfJs/v3/1/download';
        const model = await tf.loadGraphModel(modelUrl, {
          onProgress: (fraction: number) =>
            setLoadedFraction(fraction),
          fromTFHub: true,
        });
        setModel(model);
      } catch (error) {
        console.error('Failed to load model', error);
      }
    };
    modelLoader();
  });
}, []);
```