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
            pl.col("Année"), pl.col("Valeur_Mesurée").alias("Montant_dette") / 1000
        )
        .join(
            depense_france_par_an.select(
                pl.col("Année"), pl.col("Montant").name.suffix("_dépense")
            ),
            on="Année",
        )
        .join(
            impot_france_par_an.select(
                pl.col("Année"), pl.col("Montant").name.suffix("_impôt") / 1000
            ),
            on="Année",
        )
        .sort("Année")
    )
    joined_data.collect()
    return (joined_data,)


@app.cell
def _(alt, joined_data):
    base = (
        alt.Chart(joined_data.collect())
        .mark_point()
        .encode(
            x=alt.X("Montant_impôt:Q", sort="ascending"),
            y=alt.Y("Montant_dépense:Q", sort="ascending"),
            color=alt.Color("Année:Q", scale={"scheme": "oranges"}),
            tooltip=[
                alt.Tooltip("Montant_impôt:Q", format=",.2f"),
                alt.Tooltip("Montant_dépense:Q", format=",.2f"),
                alt.Tooltip("Année:Q", format=",.0f"),
            ],
        )
        .properties(
            height=282,
            width=482,
        )
    )

    identity_line = (
        alt.Chart()
        .mark_rule(strokeDash=[4, 4])
        .encode(
            x=alt.datum(alt.expr("domain('x')[0]"), type="quantitative"),
            y=alt.datum(alt.expr("domain('x')[0]"), type="quantitative"),
            x2=alt.datum(
                alt.expr("domain('x')[1]")
            ),  # inherits "quantitative" from x
            y2=alt.datum(
                alt.expr("domain('x')[1]")
            ),  # inherits "quantitative" from y
        )
    )  # either the x or y domain could be used to compute the line coordinates

    _chart = (base + identity_line).configure_axis(grid=True)

    _chart
    return


@app.cell
def _(joined_data):
    joined_data.head().collect().write_json()
    return


@app.cell
def _(depense_france_par_an, dette_france, impot_france_par_an, pl):
    concat_data = pl.concat(
        [
            dette_france.select(
                pl.col("Année"), (pl.col("Valeur_Mesurée") / 1000).alias("Montant")
            ).with_columns(pl.lit("Dette").alias("Type")),
            depense_france_par_an.select(
                pl.col("Année"), pl.col("Montant")
            ).with_columns(pl.lit("Dépense").alias("Type")),
            impot_france_par_an.select(
                pl.col("Année"), pl.col("Montant") / 1000
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
            # xOffset="Type:O",
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


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    # EURO
    """)
    return


@app.cell
def _():
    ordre = ["Cde_Pays", "Pays", "Année"]
    return (ordre,)


@app.cell
def _(pl):
    depense_euro = pl.scan_parquet("./data/parquet_long/depenses_euro.parquet")
    return (depense_euro,)


@app.cell
def _(depense_euro, ordre, pl):
    depense_euro_par_an = (
        depense_euro.group_by(ordre)
        .agg((pl.col("Montant").alias("Dépense").sum() * 1_000_000_000))
        .sort(ordre)
    )
    return (depense_euro_par_an,)


@app.cell
def _(ordre, pl):
    impot_euro = pl.scan_parquet("./data/parquet_long/impots.parquet")
    impot_euro_par_an = (
        impot_euro.group_by(ordre)
        .agg(pl.col("Montant").alias("Impôt").sum() * 1_000_000)
        .sort(ordre)
    )
    return impot_euro, impot_euro_par_an


@app.cell
def _(ordre, pl):
    dette_euro = pl.scan_parquet("./data/parquet_long/dette.parquet")
    dette_euro_par_an = (
        dette_euro.filter(pl.col("Unité") == "Monnaie nationale")
        .group_by(ordre)
        .agg(pl.col("Valeur_Mesurée").alias("Dette").sum() * 1_000_000)
        .sort(ordre)
    )
    return dette_euro, dette_euro_par_an


@app.cell
def _(pl):
    pop_euro = pl.scan_parquet("./data/parquet_long/population.parquet")
    pop_euro_par_an = (
        pop_euro.group_by("Cde_Pays", "Année")
        .agg(pl.col("Total").sum().alias("Population"))
        .sort("Cde_Pays", "Année")
    )
    return pop_euro, pop_euro_par_an


@app.cell
def _(
    depense_euro_par_an,
    dette_euro_par_an,
    impot_euro_par_an,
    ordre,
    pl,
    pop_euro_par_an,
):
    euro_joined = (
        pop_euro_par_an.join(depense_euro_par_an, on=["Cde_Pays", "Année"])
        .join(impot_euro_par_an, on=ordre)
        .join(dette_euro_par_an, on=ordre)
        .with_columns(
            pl.col("Dépense") / pl.col("Population"),
            pl.col("Impôt") / pl.col("Population"),
            pl.col("Dette") / pl.col("Population"),
        )
        .sort(ordre)
        .select(pl.exclude(["Cde_Pays", "Population"]))
    )
    euro_joined.collect()
    return (euro_joined,)


@app.cell
def _(pl):
    def to_dict(df, by):
        return {
            name[0]: group.select(pl.exclude(by)).to_dict(as_series=False)
            for name, group in df.collect().group_by(by, maintain_order=True)
        }

    return (to_dict,)


@app.cell
def _(euro_joined, pl):
    (
        euro_joined.select(pl.exclude("Pays"))
        .select(
            pl.all().min().name.suffix("_min"), pl.all().max().name.suffix("_max")
        )
        .collect()
        .transpose(
            include_header=True,
            header_name="variable",
            # column_names=["min", "max"],
        )
    )
    return


@app.cell
def _(euro_joined, pl):
    euro_stats = euro_joined.select(pl.exclude("Pays")).describe().filter(
        pl.col("statistic").is_in(["min", "max"])
    ).select(pl.exclude("statistic")).transpose(
        include_header=True,
        header_name="variable",
        column_names=["min", "max"],
    )
    euro_stats
    return


@app.cell
def _(euro_joined, pl):

    metrics = ["Année", "Impôt", "Dépense", "Dette"]

    agg = (
        euro_joined
        .select(metrics)
        .select(
            pl.all().min().name.suffix("_min"),
            pl.all().max().name.suffix("_max"),
        )
        .collect()
    )

    row = agg.row(0, named=True)

    result = {
        "Année":   [int(row["Année_min"]),   int(row["Année_max"])],
        "impot":   [row["Impôt_min"],        row["Impôt_max"]],
        "dépense": [row["Dépense_min"],      row["Dépense_max"]],
        "dette":   [row["Dette_min"],        row["Dette_max"]],
    }
    result
    return (result,)


@app.cell
def _(by, df, pl):
    {
            name[0]: group.select(pl.exclude(by)).to_dict(as_series=False)
            for name, group in df.collect().group_by(by, maintain_order=True)
        }
    return


@app.cell
def _(euro_joined, to_dict):
    to_dict(euro_joined, "Pays")
    return


@app.cell
def _(euro_joined, result, to_dict):
    import json

    with open("aggregated-data.json", "w") as fp:
        json.dump({"stats": result, "data": to_dict(euro_joined, "Pays")}, fp)
    return


@app.cell
def _(dette_euro_par_an):
    dette_euro_par_an.collect()
    return


@app.cell
def _(depense_euro_par_an):
    depense_euro_par_an.describe()
    return


@app.cell
def _(depense_euro_par_an):
    depense_euro_par_an.group_by("Pays").len().collect()
    return


@app.cell
def _(depense_euro_par_an):
    depense_euro_par_an.group_by("Pays").min().collect()
    return


@app.cell
def _(depense_euro_par_an):
    depense_euro_par_an.group_by("Pays").max().collect()
    return


@app.cell
def _(impot_euro_par_an):
    impot_euro_par_an.describe()
    return


@app.cell
def _(dette_euro):
    dette_euro.describe()
    return


@app.cell
def _(dette_euro_par_an):
    dette_euro_par_an.describe()
    return


@app.cell
def _(dette_euro):
    dette_euro.group_by("Pays").len().collect()
    return


@app.cell
def _(dette_euro_par_an):
    dette_euro_par_an.group_by("Pays").len().collect()
    return


@app.cell
def _(impot_euro):
    impot_euro.group_by(["Année", "Pays"]).len().sort(["Année", "Pays"]).collect()
    return


@app.cell
def _(impot_euro_par_an):
    impot_euro_par_an.group_by("Pays").len().collect()
    return


@app.cell
def _(impot_euro):
    impot_euro.collect()
    return


@app.cell
def _(pop_euro):
    pop_euro.collect()
    return


@app.cell
def _():
    import altair as alt

    return (alt,)


@app.cell
def _():
    return


@app.cell
def _():
    import marimo as mo

    return (mo,)


if __name__ == "__main__":
    app.run()
