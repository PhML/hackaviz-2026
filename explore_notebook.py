import marimo

__generated_with = "0.21.1"
app = marimo.App(width="medium")


@app.cell
def _():
    return


@app.cell
def _():
    import polars as pl

    return (pl,)


@app.cell
def _(pl):
    depense_france = pl.scan_parquet(
        "./data/parquet_long/depense_france.parquet"
    ).select(pl.exclude(["Cde_Pays", "Pays"]))
    return (depense_france,)


@app.cell
def _(depense_france):
    depense_france.collect_schema()
    return


@app.cell
def _(depense_france, pl):
    depense_france.group_by("Année").agg(pl.col("Montant").sum()).sort(
        "Année"
    ).collect()
    return


@app.cell
def _(depense_france, pl):
    depense_france_par_an = (
        depense_france.filter(pl.col("Année") >= 2002)
        .group_by("Année")
        .agg(pl.col("Montant").sum())
        .sort("Année")
    )
    depense_france_par_an.collect()
    return (depense_france_par_an,)


@app.cell
def _(pl):
    dette = pl.scan_parquet("./data/parquet_long/dette.parquet")
    return (dette,)


@app.cell
def _(dette):
    dette.collect()
    return


@app.cell
def _(dette):
    dette.collect_schema()
    return


@app.cell
def _(dette):
    dette.head().collect()
    return


@app.cell
def _(dette, pl):
    dette_france = dette.filter(pl.col("Pays") == "France").filter(
        pl.col("Unité") == "Monnaie nationale"
    )
    return (dette_france,)


@app.cell
def _(dette_france):
    dette_france.collect()
    return


@app.cell
def _(pl):
    impot = pl.scan_parquet("./data/parquet_long/impots.parquet")
    return (impot,)


@app.cell
def _(impot):
    impot.head().collect()
    return


@app.cell
def _(impot, pl):
    impot_france = impot.filter(pl.col("Pays") == "France")
    return (impot_france,)


@app.cell
def _(impot_france, pl):
    impot_france_par_an = (
        impot_france.group_by("Année").agg(pl.col("Montant").sum()).sort("Année")
    )
    impot_france_par_an.collect()
    return (impot_france_par_an,)


@app.cell
def _(depense_france_par_an, dette_france, impot_france_par_an, pl):
    joined_data = (
        dette_france.select(
            pl.col("Année"), pl.col("Valeur_Mesurée").alias("Montant_dette")
        )
        .join(
            depense_france_par_an.select(
                pl.col("Année"), pl.col("Montant").name.suffix("_dépense")
            ),
            on="Année",
        )
        .join(
            impot_france_par_an.select(
                pl.col("Année"), pl.col("Montant").name.suffix("_impôt")
            ),
            on="Année",
        ).sort("Année")
    )
    joined_data.collect()
    return


@app.cell
def _(depense_france_par_an, dette_france, impot_france_par_an, pl):
    concat_data = pl.concat(
        [
            dette_france.select(
                pl.col("Année"), (pl.col("Valeur_Mesurée")/1000).alias("Montant")
            ).with_columns(pl.lit("Dette").alias("Type")),
            depense_france_par_an.select(
                pl.col("Année"), pl.col("Montant")
            ).with_columns(pl.lit("Dépense").alias("Type")),
            impot_france_par_an.select(
                pl.col("Année"), pl.col("Montant")/1000
            ).with_columns(pl.lit("Impôt").alias("Type")),
        ]
    ).sort(pl.col("Année"), pl.col("Type"))
    return (concat_data,)


@app.cell
def _(concat_data):
    concat_data.collect()
    return


@app.cell
def _(alt, concat_data):
    _chart = (
        alt.Chart(concat_data.collect())
        .mark_bar()
        .encode(
            x="Type:N",
            y="Montant:Q",
            color="Type:N",
            #xOffset="Type:O",
            column="Année:O",
            tooltip=[
                alt.Tooltip(field="Année"),
                alt.Tooltip(field="Montant", format=",.2f"),
                alt.Tooltip(field="Type"),
            ],
        )
        #  .properties(
        #    height=290, width="container", config={"axis": {"grid": False}}
        # )
    )
    _chart
    return


@app.cell
def _(alt):
    from altair.datasets import data

    source = data.barley()

    alt.Chart(source).mark_bar().encode(
        x="year:O", y="sum(yield):Q", color="year:N", column="site:N"
    )
    return (source,)


@app.cell
def _(source):
    source
    return


@app.cell
def _(alt, source):
    alt.Chart(source).mark_bar().encode(
        x="year:O", y="yield:Q", color="year:N", column="variety:N"
    )
    return


@app.cell
def _():
    import altair as alt

    return (alt,)


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
