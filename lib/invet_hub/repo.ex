defmodule InvetHub.Repo do
  use Ecto.Repo,
    otp_app: :invet_hub,
    adapter: Ecto.Adapters.MyXQL
end
