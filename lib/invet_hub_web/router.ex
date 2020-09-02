defmodule InvetHubWeb.Router do
  use InvetHubWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug(InvetHubWeb.Plugs.SetUser)
    plug(InvetHubWeb.Plugs.SessionTimeout, timeout_after_seconds: 3_600)
  end

  pipeline :api do
    plug :accepts, ["json"]
  end
  pipeline :session do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:put_secure_browser_headers)
  end

  scope "/", InvetHubWeb do
    pipe_through([:session])
    get("/", SessionController, :index)
    post("/login", SessionController, :create)
    get("/recover", SessionController, :recover)
    post("/recover_password", SessionController, :recover_password)
    get("/recover_password", SessionController, :recover_password)
    get("/change_password", SessionController, :change_password)
    post("/password/changed", SessionController, :update_password)
    get("/password/changed", SessionController, :update_password)
    get("/reset", SessionController, :reset)
    get("/forgot/password", UserController, :forgot_password)
    post("/confirmation/token", UserController, :token)
    get("/reset/password", UserController, :default_password)
  end

  scope "/", InvetHubWeb do
    pipe_through([:browser])
    get("/logout/current/user", SessionController, :sign_out)
  end

  scope "/", InvetHubWeb do
    pipe_through :browser

    get "/dashboard", DashboardController, :index
    get "/dashboard/all", DashboardController, :all
    get "/dashboard/branch/kabwata", DashboardController, :kabwata
    get "/dashboard/branch/ibex_hill", DashboardController, :ibex_hill
    get "/dashboard/branch/soweto", DashboardController, :soweto
    get "/dashboard/branch/lumumba", DashboardController, :lumumba
    #--------------------------------------------------------------------
    get "/Reports/start", ReportsController, :start
    post "/Dashboard/start/Reports", ReportsController, :index
    #-------------------------------------------------------------
    get"/InvetHub/user/view_users", UserController, :index
    get"/InvetHub/list_user_logs", UserController, :user_logs
    get"/InvetHub/create_user", UserController, :create
    get"/InvetHub/user/edit", UserController, :edit
    post "/InvetHub/user/delete", UserController, :delete
    get "/InvetHub/user/delete", UserController, :delete
    post "/InvetHub/user/add", UserController, :add
    post "/InvetHub/user/edit/update", UserController, :update
    get "/InvetHub/user/edit/update/users", UserController, :update
    #-------------------------------------------------------------
    get"/InvetHub/view_system_logs", UserController, :system_logs
    #-------------------------------------------------------------
    get "/InvetHub/catalog/list_branch", CatalogController, :list_branch
    post "/InvetHub/catalog/add_branch", CatalogController, :add_branch
    get "/InvetHub/catalog/add_branch", CatalogController, :add_branch
    post "/InvetHub/catalog/delete_branch", CatalogController, :delete_branch
    get "/InvetHub/catalog/delete_branch", CatalogController, :delete_branch
    post "/InvetHub/catalog/update_branch", CatalogController, :update_branch

    get "/InvetHub/catalog/list_variation", CatalogController, :list_varations
    post "/InvetHub/catalog/variation/add", CatalogController, :add
    post "/InvetHub/catalog/variation/update", CatalogController, :update
    post "/InvetHub/catalog/variation/delete", CatalogController, :delete
    get "/InvetHub/catalog/variation/delete", CatalogController, :delete

    #-------------------------------------------------------------
    post "/InvetHub/Inventory/view_inventory", InventoryController, :index
    get "/InvetHub/Inventory/view_inventory", InventoryController, :index
    get "/InvetHub/Inventory/inventory/history", InventoryController, :history
    post "/InvetHub/Inventory/inventory/add", InventoryController, :add
    post "/InvetHub/Inventory/inventory/move", InventoryController, :move_to_branch
    get "/InvetHub/Inventory/inventory/move", InventoryController, :move_to_branch
    get "/InvetHub/Inventory/edit", InventoryController, :edit
    post "/InvetHub/Inventory/edit", InventoryController, :update
    post "/invetHub/Inventory/inventory/delete", InventoryController, :delete
    post "/invetHub/Inventory/inventory/clear_stock", InventoryController, :clear_stock
    get "/invetHub/Inventory/inventory/delete", InventoryController, :delete
    #-------------------------------------------------------------
  end
  # Other scopes may use custom stacks.
  # scope "/api", InvetHubWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: InvetHubWeb.Telemetry
    end
  end
end
