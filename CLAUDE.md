## Popis projektu
Projekt je určen pro děti v předškolním věku (3-6 let)

## Stránky

### Stránka s volbou obtížnosti

### Mapa levelů

### Detail levelu

### Režim opakování
- Obsahuje vždy 2 možnosti na výběr (zvolená obtížnost nemá vliv na počet možností)
- Zobrazuje vždy jen možnosti z předešlých levelů


## Pravidla projektu:
- Na mapě levelů se levely vykreslují ve skupinách.
- Jsou 3 typy skupin: standardní, herní, odemna
- V herní skupině a odmeně je vždy jen jedna položka
- V standardní skupině je položek více
- Na konci každé standardní skupiny je level opakování
- Po dokončení každé skupiny se odemyká další skupina, do té doby je uzamčená a uživatel do ní nemůže přistoupit
- Každá skupina může obsahovat maximálně 5 levelů
- Vždy se střídá skupina standardní, skupina herní a pak odměna (STANDARD → GAME → AWARD → STANDARD → GAME → AWARD)

## Pravidla pro obtížnosti:
- Pro každý level je definována množina možností
- Slova, které obsahují písmeno "r" jsou pouze ve skupinách "lištička" a "lev", protože jsou obtížná na výslovnost. Ale pokud by v daném levelu nezůstala žádná položka, pak tam nech alespoň jednu.

### Kuřátko
- V každém levelu zobrazuje maximálně 3 možnosti

### Lištička
- V každé mlevelu zobrazuje maximálně 4 možnosti

### Lev
- V každém levelu zobrazuje maximálně 6 možností


## UI/UX požadavky a responzivita

### Prioritní rozlišení

- Každý level by se měl vejít na jednu obrazovku bez nutnosti scrollování
- Níže je seznam zařízení na kterých aplikaci používám nejčastěji

#### Mobil (portrait)
- **350x720 px** - primární cílové rozlišení pro mobil
- Všechny interaktivní prvky musí být dostatečně velké pro dotykové ovládání

#### Tablet (landscape)
- **1024x600 px** - cílové rozlišení pro tablet (například Blackview Tab 6)
- Layout se má přizpůsobit širšímu formátu (možnosti vedle sebe místo pod sebou)
- Všechny interaktivní prvky musí být dostatečně velké pro dotykové ovládání
- Využít šířku obrazovky pro lepší rozmístění elementů

