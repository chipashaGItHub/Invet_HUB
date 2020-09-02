# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :invet_hub,
  ecto_repos: [InvetHub.Repo]

config :endon,
       repo: InvetHub.Repo

# Configures the endpoint
config :invet_hub, InvetHubWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "sBWxy/M93lFKfKQwh/ECjsnJEQ5C9prHjn1WoDwAsfg7QtJ6HUJUQ0Ks62zdQmM/",
  render_errors: [view: InvetHubWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: InvetHub.PubSub,
  live_view: [signing_salt: "CIsbfprw"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# quantum jobs config
config :logger, level: :debug

# config :invet_hub, InvetHub.Endpoint, server: true

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"


#BAMBOO EMAIL CONFIGURATIONS
# ------------------------Email Config -------------------------------#
config :invet_hub, InvetHub.Mailer,
       adapter: Bamboo.SMTPAdapter,
       server: "smtp.gmail.com",
       port: 587,
         # or {:system, "SMTP_USERNAME"}
       username: "victormumbi0@gmail.com",
         # or {:system, "SMTP_PASSWORD"}
       password: "Brokenv1c",
         # can be `:always` or `:never`
       tls: :if_available,
       allowed_tls_versions: [:tlsv1, :"tlsv1.1", :"tlsv1.2"],
         # can be `true`
       ssl: false,
       retries: 2
