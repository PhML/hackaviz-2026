# Hackaviz-2026
# Introduction
L'Hackackiz 2026 parle des **budgets des états européens**. Afin de pouvoir comparer les budgets de ces différents états, ces derniers sont organisés selon une classification comptable, la [COFOG](https://en.wikipedia.org/wiki/Classification_of_the_Functions_of_Government) (Classification Of the Fonctions Of Government) qui ventile les dépenses des administrations publiques selon les objectifs des fonds. Cette classification créée en 1993, révisée en 1999 est issue de l'[OCDE](https://fr.wikipedia.org/wiki/Organisation_de_coop%C3%A9ration_et_de_d%C3%A9veloppement_%C3%A9conomiques) (Organisation de coopération et de développement économique).

L'objectif de ces dépenses étant en premier lieu le **bien-être des populations**, nous avons aussi regroupé une liste de critères par pays qui, ensemble, visent à quantifier le bien-être subjectif des individus. 

Ces deux jeux de données sont disponibles pour les pays de l'OCDE également membres de la zone euro de 2002 à 2025. Pour ceux qui souhaiteraient aller plus loin, ont été ajouté d'autres variables optionnelles à utiliser ou pas comme : les impôts, la dette ou le produit intérieur brut.

# La classification des dépenses
| Thème | Exemples |
|:--|:--|
|  1-Services publiques|  Exécutif, législatif, impôts, recherche, gestion de la dette, ...|
|  2-Défense|  Défense civile et militaire, aide internationale, ... |
| 3-Ordre public et sécurité | Police, pompiers, justice, prisons, ... |
| 4-Affaires économiques |  Agriculture, énergie, constructions, industries, transport, communication, ...|
|  5-Protection de l'environnement|  Gestion des ordures, épuration de l'eau, pollutions, protection des espèces, ...|
| 6-Habitat|  Développement, voiries, eau, éclairages, ...|
| 7-Santé|  Matériels, médicaments, hôpitaux, recherche, ...|
| 8-Sports, culture et religions| Sports, services public de diffusion, culture, ...  |
| 9-Education | Ecoles, collèges, lycées, universités, services, ...|
| 10-Protection sociale | Maladie, vieillesse, famille, chômage, exclusion, ... |

[Sources](https://www.oecd.org/fr/publications/panorama-des-administrations-publiques-2025_758a7905-fr/full-report/classification-of-the-functions-of-government-cofog_16aa2337.html)

Sauf indication contraire, les montants monétaires sont les milliard d'euros.

Cette classification a le mérite de permettre la comparaison mais présente certains défauts qui peuvent entacher les interprétations : 
 - Ambiguïté de finalité : certaines dépenses contribuent à plusieurs finalités mais ne sont comptabilisées que dans une
 - Ne fait pas de distinction entre le fonctionnement et l'investissement
 - Soumise à l'arbitraire de l'interprétation de chaque pays

# Les facettes du bien être
Bien qu'il soit impossible de chiffrer le bonheur, il est néanmoins possible d'approcher la réalité par un ensemble de critères subjectifs (note entre 0 et 10) et des moyennes nationales (revenu médian, pourcentage de foyer équipé d'internet, ...). Une liste de 60 critères quantitatifs organisés en domaines :  [Source](https://www.oecd.org/fr/data/tools/well-being-data-monitor.html)


| Domaine | Exemples |
|:--|:--|
| Logement | - Ménages vivant dans des logements surpeuplés <br> - Accessibilité financière du logement |
| Savoirs et compétences | - Adultes ayant de faibles compétences en calcul <br> - Compétences des élèves en compréhension de l’écrit|
| Revenu et patrimoine | - Patrimoine net médian <br> - Salaire brut annuel moyen |
| Bien-être subjectif | - Sentiment de solitude <br>  - Satisfaction à l’égard de la vie |
| Liens sociaux | - Satisfaction à l’égard des relations personnelles inférieure à 5 <br>  - Manque de soutien social |
| Qualité environnementale | - Accès à des espaces verts <br> - Exposition à la pollution de l’air |
| Engagement civique | - Participation électorale <br> - Ne pas avoir son mot à dire concernant l’action des pouvoirs publics |
| Equilibre travail-vie | - Quintile supérieur de la satisfaction à l’égard de l’emploi du temps <br> - Satisfaction au travail |
| Santé | - Espérance de vie à la naissance <br> - Etat de santé perçu comme bon |
| Sécurité | - Sentiment d’insécurité la nuit <br> - Homicides |

 Disponibles par pays et par années entre 2004 et 2025

# La population (nombre et répartition)
Afin d'analyser ces données il est nécessaire de disposer de contexte. C'est le rôle de deux fichiers :
 - population 
 - pyramide_age
   
par pays x année de 2002 à 2024

# Contexte supplémentaire
Pour ne pas limiter les appétits 3 autres variables ont été ajoutées
 - pib (Produit Intérieur Brut)
 - impots 
 - dette
   
par pays x années de 2002 à 2024
   
# Fichiers additionnels pour cartographie
Pour aider à la présentation des résultats sous forme de cartes, est mis à disposition une carte au format geojson:
 - carte.geojson
   
Rappel du règlement : il est interdit de rajouter des données hormis des fonds de carte.

# Fichiers et formats
Les données sont fournies sous deux formats logiques :
 - long : chaque observation est sur plusieurs lignes, une par variable (identifiant, valeur) 
 - large : une observation est sur une ligne, avec autant de variables/valeurs que de colonnes

Et sous deux formats physique :
 - xls/csv : le désavantage de csv est l'absence de typage des champs
 - parquet

Vous avez le choix de la combinaison de formats. **Les 4 répertoires suivants contiennent les mêmes données** mais aux formats indiqués :
 - csv_large
 - xls_large
 - csv_long
 - parquet_long

Chacun de ces répertoires contient les fichiers suivants, avec le suffixe correspondant à son format (csv, xls ou parquet)
 - depenses_euro
 - depenses_france
 - bien_etre
---   
 - population
 - pyramide_age
---
 - pib
 - dette
 - impots

# Conseils aux participants de l'édition 2026

Cette édition de l'Hackaviz propose une grande richesse de données dans lesquelles il ne faut pas se perdre. 
* Il n'est pas obligatoire d'utiliser toutes les données
* La plupart des fichiers ont 2 dimensions : pays x année voire 3 pour les dépenses : pays x thème x année
* Il y a beaucoup de fichiers (8) mais cela permet de manière souple d'intégrer ou non une variable
* ATTENTION : Le fichier **principal** de cet Hackaviz est le fichier **depenses**, le jury jugera de manière défavorable le fait de ne pas du tout l'utiliser
* Ne perdez pas de temps à examiner toutes les possibilités. Prenez plutôt un angle et creusez-le, quitte à revenir en prendre un autre si besoin.
* Comme d'habitude relisez le [règlement](https://toulouse-dataviz.fr/hackaviz/reglement/) avant de vous précipiter sur les données


