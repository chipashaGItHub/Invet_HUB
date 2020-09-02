defmodule InvetHub.MixProject do
  use Mix.Project

  def project do
    [
      releases: [
        invet_hub_dev: [
          include_executables_for: [:windows],
          applications: [runtime_tools: :permanent]
          ]
        ],
      app: :invet_hub,
      version: "0.1.0",
      elixir: "~> 1.7",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      build_embedded: Mix.env == :prod,
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {InvetHub.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.5.3"},
      {:phoenix_ecto, "~> 4.1"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 2.11"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_dashboard, "~> 0.2.0"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:gettext, "~> 0.11"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:ecto_sql, "~> 3.1"},
      {:myxql, ">= 0.0.0"},
#      {:tds_ecto, "~> 2.2.0"},
      {:ex_doc, "~> 0.21"},
      {:cachex, "~> 3.2"},
      {:sched_ex, "~> 1.0"},
      {:yaml_elixir, "~> 2.4.0"},
      {:skooma, "~> 0.2.0"},
      {:timex, "~> 3.5"},
      {:absinthe, "~> 1.4"},
      {:absinthe_plug, "~> 1.4"},
      {:phone, "~> 0.4.9"},
      {:cuid, "~> 0.1.0"},
      {:credo, "~> 1.2", only: [:dev, :test], runtime: false},
      {:websockex, "~> 0.4.2"},
      {:calendar, "~> 0.17.0"},
      {:quantum, "~> 2.2.7"},
      {:date_time_parser, "~> 0.2.0"},
      {:endon, "~> 1.0"},
      {:bamboo, "~> 1.3"},
      {:chartkick, "~>0.4.0"},
      {:bamboo_smtp, "~> 2.1.0"},
      {:gen_smtp, "~> 0.13"},
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "cmd npm install --prefix assets"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"]
    ]
  end
end
