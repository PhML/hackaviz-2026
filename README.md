# Hackaviz-2026
# Introduction
Les données de l'Hackackiz 2026 concernent les **budgets des états européens**. Pour mettre tous ces budgets dans une forme "comparable" a été défini la [COFOG](https://en.wikipedia.org/wiki/Classification_of_the_Functions_of_Government) (Classification Of the Fonctions Of Governement) qui ventile les dépenses des administrations publiques selon les objectifs des fonds. Cette classification créée en 1993, révisée en 1999 est issue de l'[OCDE](https://fr.wikipedia.org/wiki/Organisation_de_coop%C3%A9ration_et_de_d%C3%A9veloppement_%C3%A9conomiques) (Organisation de coopération et de dévelopement économique).

L'objectif de ces dépenses étant en premier lieu le **bien être des populations**, nous avons aussi regroupé une liste de critères par pays qui ensemble visent à quantifier le bien être subjectif des individus, ainsi que des critères globaux. 

Ces deux jeux de données sont disponibles pour les pays de l'OCDE de la zone euro de 2002 à 2025 et pour la France à un niveau de détail plus bas.

# La classification des dépenses
| Thème | Exemples |
|:--|:--|
|  1-Services publiques|  Executif, législatif, impôts, recherche, gestion de la dette, ...|
|  2-Défense|  Défense civile et militaire, aide internationale, ... |
| 3-Ordre public et sécurité | Police, pompiers, justice, prisons, ... |
| 4-Affaires économiques |  Agriculture, énergie, constructions, industries, transport, communication, ...|
|  5-Protection de l'environnement|  Gestion des ordures, épuration de l'eau, pollutions, protection des espèces, ...|
| 6-Habitat|  Développement, voiries, eau, éclairages, ...|
| 7-Santé|  Matériels, médicaments, hopitaux, recherche, ...|
| 8-Sports, culture et religions| Sports, services public de diffusion, culture, ...  |
| 9-Education | Ecoles, collèges, lycées, universités, services, ...|
| 10-Protectiion sociale | Maladie, vieilesse, famille, chômage, exclusion, ... |

Cette classification a le mérite de permettre la comparaison mais présente certains défauts qui peuvent entacher les interpretations : 
 - Ambiguité de finalité : certaines dépenses contribuent à plusieurs finalités mais ne sont comptabilisées que dans une
 - Ne fait pas de distinction entre le fonctionnement et l'investissement
 - Soumise à l'arbitraire de l'interprétation de chaque pays

# Les facettes du bien être
Bien qu'il soit impossible de chiffrer le bien être, il est néanmoins possible d'approcher cette rélaité par un ensemble de critères subjectifs (note entre 0 et 10) et des moyennes nationales (revenu médian, pourcentage de foyer équipé d'internet, ...). Une liste de 60 critères quantitatifs organisés par catégories :


| Thème | Exemples |
|:--|:--|
| Logement | - Ménages vivant dans des logements surpeuplés <br> - Accessibilité financière du logement |
| Savoirs et compétences | - Adultes ayant de faibles compétences en calcul <br> - Compétences des élèves en compréhension de l’écrit|
| Revenu et patrimoine | - Patrimoine net médian <br> - Salaire brut annuel moyen |
| Bien-être subjectif | - Sentiment de solitude <br>  - Satisfaction à l’égard de la vie |
| Liens sociaux | - Satisfaction à l’égard des relations personnelles inférieure à 5 <br>  - Manque de soutien social |
| Qualité environnementale | - Accès à des espaces verts <br> - Exposition à la pollution de l’air
|
| Engagement civique | - Participation électorale <br> - Ne pas avoir son mot à dire concernant l’action des pouvoirs publics |
| Equilibre travail-vie | - Quintile supérieur de la satisfaction à l’égard de l’emploi du temps
<br> - Satisfaction au travail |
| Santé | - Espérance de vie à la naissance <br> - Etat de santé perçu comme bon |
| Sécurité | - Sentiment d’insécurité la nuit <br> - Homicides |

 



# La population (nombre et répartition)
Afin d'analyser ces données il est nécessaire de disposer de contexte. C'est le role de deux fichiers :
 - population totale,  x années x pays <- case blanche possible
 - tranche 65+, tranche <10, pyramide_des_ages x années x pays


# Contexte supplémentaire
 - impots x années x pays
 - PIB, dette,

 - 
# Fichiers additionnels pour cartographie
Pour aider à la présentation des résultats, sont mis à disposition deux cartes :
 - ocde.geojson
 - france.geojson
Rappel du réglement : il est interdit de rajouter des données hormis des fonds de carte.

# Fichiers et formats
Les données sont fournies sous deux formats logiques :
 - long : chaque observation est sur plusieurs lignes, une par variable (identifiant, valeur) 
 - large : une observation est sur une ligne, avec autant de variables/valeurs que de colonnes

Et sous deux formats physique :
 - xls /csv
 - parquet

Pointeur vers -> lire du parquet 









