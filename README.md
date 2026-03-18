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
Bien qu'il soit impossible de chiffrer le bien être, il est néanmoins possible d'approcher cette rélaité par un ensemble de critères subjectifs (note entre 0 et 10) et des moyennes nationales (revenu médian, pourcentage de foyer équipé d'internet, ...)


| Thème | Exemples |
|:--|:--|
| Logement |  |
| Savoirs et compétences |  |
| Revenu et patrimoine |  |
| Bien-être subjectif,|  |
| Liens sociaux |  |
| Qualité environnementale |  |
| Engagement civique,|  |
| Equilibre travail-vie|  |
| Santé |  |
| Sécurité |  |

Une longue liste de 60 critères (**à réorganiser par catégories**) : 

- Ménage disposant d'un accès internet
- Ménages vivant dans des logements surpeuplés
- Accessibilité financière du logement
- Décile supérieur des résultats des adultes en calcul
- Décile supérieur des résultats des adultes en lecture et écriture
- Décile supérieur des résultats en compréhension de l’écrit
- Décile supérieur des résultats en mathématiques
- Décile supérieur des résultats en sciences
- Adultes ayant de faibles compétences en calcul
- Faible compétences dans les trois domaines évalués par le PISA
- Compétences des adultes en calcul
- Compétences des adultes en lecture et écriture
- Compétences des élèves en compréhension de l’écrit
- Compétences des élèves en sciences
- Compétences des élèves en mathématiques
- Quintile supérieur de la satisfaction à l’égard de la vie
- Décile supérieur des ménages les plus riches
- Accès à des espaces verts
- Avoir son mot à dire concernant l’action des pouvoirs publics
- Ne pas avoir son mot à dire concernant l’action des pouvoirs publics
- Écart entre les genres en termes de temps de travail
- Longues heures de travail non rémunéré
- Quintile supérieur de la satisfaction à l’égard de l’emploi du temps
- Satisfaction à l’égard de la vie
- Espérance de vie à la naissance
- Décès dus au suicide, à l’alcool ou à la drogue
- Homicides
- Exposition à des températures extrêmes
- Patrimoine financier liquide équivalent insuffisant pour se maintenir au-dessus du seuil national annuel de pauvreté monétaire relative pendant trois mois
- Exposition à la pollution de l’air
- Sentiment de solitude
- Incapacité à maintenir le logement à bonne température
- Difficultés à joindre les deux bouts
- Bilan émotionnel négatif
- Douleur physique
- Écart de rémunération entre les genres
- Décile supérieur de la rémunération des salariés à temps plein
- Insécurité sur le marché du travail
- Taux de chômage de longue durée
- Horaires de travail lourds
- Jeunes sans emploi et sortis du système éducatif
- Participation électorale
- Etat de santé perçu comme mauvais
- Etat de santé perçu comme bon
- Écart de rémunération entre les genres
- Satisfaction au travail
- Tension au travail
- Temps libre
- Temps consacré aux interactions sociales
- Taux d'emploi
- Taux de chômage de longue durée
- Surcharge financière liée au coût du logement
- Soutien social
- Manque de soutien social
- Sentiment d’insécurité la nuit
- Satisfaction à l’égard des relations personnelles inférieure à 5
- Satisfaction à l’égard de l’emploi du temps inférieure à 5
- Satisfaction à l’égard de l’emploi du temps
- Satisfaction à l’égard de la vie inférieure à 5
- Satisfaction à l’égard de la vie
- Satisfaction au travail
- Salariés à temps plein dont la rémunération est inférieure à deux tiers du salaire brut médian
- Salaire brut annuel moyen
- Revenu disponible des ménages inférieur au seuil de pauvreté monétaire relative
- Revenu disponible ajusté net des ménages et des ISBLSM par habitant
- Quintile supérieur de la satisfaction à l’égard de la vie
- Patrimoine net médian
- Mortalité routière
- Manque de soutien social

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









