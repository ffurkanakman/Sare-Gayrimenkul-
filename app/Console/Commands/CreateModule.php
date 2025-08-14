<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class CreateModule extends Command
{
    protected $signature = 'module:create {module}';
    protected $description = 'Etkileşimli olarak yeni bir modül oluşturur. (yBerk - Börü)';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $module = Str::studly($this->argument('module'));

        $this->info("Modül: $module\n");

        // Kullanıcıdan hangi bileşenlerin oluşturulacağını seçmesini iste
        $components = $this->choice(
            'Hangi bileşenleri oluşturmak istiyorsunuz? (Birden fazla seçim için virgül ile ayırın)',
            [
                'Hepsi',
                'Config',
                'Routes',
                'ExampleHttp',
                'Migration',
                'Model',
                'Repository',
                'Service',
                'Controller',
                'Resource',
                'Observer',
                'Mail',
                'Request',
                'Service Provider'
            ],
            0,
            multiple: true
        );

        // Eğer tüm bileşenler seçilirse hepsini oluştur
        if (in_array('Hepsi', $components)) {
            $components = [
                'Config',
                'Routes',
                'ExampleHttp',
                'Migration',
                'Model',
                'Repository',
                'Service',
                'Controller',
                'Resource',
                'Observer',
                'Mail',
                'Request',
                'Service Provider',

            ];
        }

        // Modül klasörünü oluştur
        $modulePath = app_path("Modules/$module");
        if (!File::exists($modulePath)) {
            File::makeDirectory($modulePath, 0755, true);
        }

        foreach ($components as $component) {
            $method = 'create' . str_replace(' ', '', $component);
            if (method_exists($this, $method)) {
                $this->$method($modulePath, $module);
            }
        }

        $this->info("\nModül $module başarıyla oluşturuldu! Enes Unatoğlu 💣🔥");
    }


    protected function createConfig($modulePath, $module)
    {
        $configPath = "$modulePath/config.php";

        if (!File::exists($configPath)) {
            $configTemplate = <<<PHP
    <?php

    return [
        'active' => true, // Modül varsayılan olarak aktif başlar
        'version' => '1.0.0',
        'author' => 'Hard Prompter'
    ];
    PHP;

            File::put($configPath, $configTemplate);
            $this->info("Config dosyası oluşturuldu: $configPath");
        } else {
            $this->warn("Config dosyası zaten mevcut: $configPath");
        }
    }


    protected function createRoutes($modulePath, $module)
    {
        $routesDirectory = $modulePath . '/routes';
        if (!File::exists($routesDirectory)) {
            File::makeDirectory($routesDirectory, 0755, true);
        }
        $rota = strtolower($module);

        $routesContent = <<<PHP
<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Modules\\$module\\Http\\Controllers\\{$module}Controller;

Route::group([
    'prefix' => 'api/$rota',
    'as' => '$rota',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [{$module}Controller::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [{$module}Controller::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [{$module}Controller::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [{$module}Controller::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [{$module}Controller::class, 'destroy'])->name('destroy'); // Silme
});
PHP;

        $routesPath = "$routesDirectory/api.php";
        File::put($routesPath, $routesContent);
        $this->info("Rota dosyası oluşturuldu: $routesPath");
    }


    protected function createExampleHttp($modulePath, $module)
    {
        // Routes klasörünün içine example.http dosyasını kaydet
        $routesDirectory = "$modulePath/routes";

        if (!File::exists($routesDirectory)) {
            File::makeDirectory($routesDirectory, 0755, true);
        }
        $rota = strtolower($module);

        $exampleHttpContent = <<<EOL
### POST request to {$module} API
POST http://localhost:8000/api/{$module}
Content-Type: application/json

{
    "name": "John Doe"
}

###

GET http://localhost:8000/api/{$rota}

###

GET http://localhost:8000/api/{$rota}/1

###

PUT http://localhost:8000/api/{$rota}/1
Content-Type: application/json

{
    "name": "Updated John Doe"
}

###

DELETE http://localhost:8000/api/{$rota}/1

###
EOL;

        // Dosya içeriklerini `routes` klasörüne kaydet
        File::put("{$routesDirectory}/example.http", $exampleHttpContent);

        $this->info("Example HTTP dosyası oluşturuldu: {$routesDirectory}/example.http");
    }


    protected function createMigration($modulePath, $module)
    {
        $migrationDirectory = "$modulePath/database/migrations";
        if (!File::exists($migrationDirectory)) {
            File::makeDirectory($migrationDirectory, 0755, true);
        }

        $tableName = strtolower(\Illuminate\Support\Str::snake(\Illuminate\Support\Str::plural($module)));

        $migrationContent = <<<PHP
    <?php

    use Illuminate\\Database\\Migrations\\Migration;
    use Illuminate\\Database\\Schema\\Blueprint;
    use Illuminate\\Support\\Facades\\Schema;

    return new class extends Migration {
        public function up()
        {
            Schema::create('$tableName', function (Blueprint \$table) {
                \$table->id();
                \$table->string('name');
                \$table->softDeletes();
                \$table->timestamps();
            });
        }

        public function down()
        {
            Schema::dropIfExists('$tableName');
        }
    };
    PHP;

        $migrationFileName = date('Y_m_d_His') . "_create_{$tableName}_table.php";
        $migrationFilePath = "$migrationDirectory/$migrationFileName";
        File::put($migrationFilePath, $migrationContent);
        $this->info("Migration oluşturuldu: $migrationFilePath");
    }


    protected function createModel($modulePath, $module)
    {
        $modelDirectory = "$modulePath/Models";
        if (!File::exists($modelDirectory)) {
            File::makeDirectory($modelDirectory, 0755, true);
        }

        $tableName = strtolower(\Illuminate\Support\Str::snake(\Illuminate\Support\Str::plural($module)));

        $modelContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Models;

    use Illuminate\\Database\\Eloquent\\Model;
    use Illuminate\\Database\\Eloquent\\SoftDeletes;

    class $module extends Model
    {
        use SoftDeletes;

        protected \$table = '$tableName';
        protected \$fillable = ['name'];
        protected \$dates = ['deleted_at'];
        protected \$casts = [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
    PHP;

        $modelPath = "$modelDirectory/{$module}.php";
        File::put($modelPath, $modelContent);
        $this->info("Model oluşturuldu: $modelPath");
    }


    protected function createRepository($modulePath, $module)
    {
        $repositoryDirectory = "$modulePath/Repositories";
        if (!File::exists($repositoryDirectory)) {
            File::makeDirectory($repositoryDirectory, 0755, true);
        }

        $modelNamespace = "App\\Modules\\$module\\Models\\$module";

        $repositoryContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Repositories;

    use $modelNamespace;

    class {$module}Repository
    {
        public function all()
        {
            return $module::all();
        }

        public function paginate(\$perPage = 15)
        {
            return $module::paginate(\$perPage);
        }

        public function find(\$id)
        {
            return $module::findOrFail(\$id);
        }

        public function create(array \$data)
        {
            return $module::create(\$data);
        }

        public function update(\$id, array \$data)
        {
            \$model = $module::findOrFail(\$id);
            \$model->update(\$data);
            return \$model;
        }

        public function delete(\$id)
        {
            \$model = $module::findOrFail(\$id);
            return \$model->delete();
        }
    }
    PHP;

        $repositoryPath = "$repositoryDirectory/{$module}Repository.php";
        File::put($repositoryPath, $repositoryContent);
        $this->info("Repository dosyası oluşturuldu: $repositoryPath");
    }


    protected function createService($modulePath, $module)
    {
        $serviceDirectory = "$modulePath/Services";
        if (!File::exists($serviceDirectory)) {
            File::makeDirectory($serviceDirectory, 0755, true);
        }

        $repoVar = lcfirst($module) . 'Repository';
        $repositoryNamespace = "App\\Modules\\$module\\Repositories\\{$module}Repository";

        $serviceContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Services;

    use $repositoryNamespace;

    class {$module}Service
    {
        protected \${$repoVar};

        public function __construct({$module}Repository \${$repoVar})
        {
            \$this->{$repoVar} = \${$repoVar};
        }

        public function all()
        {
            return \$this->{$repoVar}->all();
        }

        public function create(array \$data)
        {
            return \$this->{$repoVar}->create(\$data);
        }

        public function find(\$id)
        {
            return \$this->{$repoVar}->find(\$id);
        }

        public function update(\$id, array \$data)
        {
            return \$this->{$repoVar}->update(\$id, \$data);
        }

        public function delete(\$id)
        {
            return \$this->{$repoVar}->delete(\$id);
        }
    }
    PHP;

        $servicePath = "$serviceDirectory/{$module}Service.php";
        File::put($servicePath, $serviceContent);
        $this->info("Service dosyası oluşturuldu: $servicePath");
    }



    protected function createController($modulePath, $module)
    {
        $controllerDirectory = "$modulePath/Http/Controllers";
        if (!File::exists($controllerDirectory)) {
            File::makeDirectory($controllerDirectory, 0755, true);
        }

        $serviceVar = lcfirst($module) . 'Service';
        $serviceModelName = lcfirst($module);
        $serviceNamespace = "App\\Modules\\$module\\Services\\{$module}Service";
        $requestNamespace = "App\\Modules\\$module\\Http\\Requests\\{$module}Request";
        $resourceNamespace = "App\\Modules\\$module\\Http\\Resources\\{$module}Resource";

        $controllerContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Http\\Controllers;

    use App\\Http\\Controllers\\Controller;
    use $serviceNamespace;
    use $requestNamespace;
    use $resourceNamespace;
    use Illuminate\\Http\\JsonResponse;
    use App\\Traits\\HandlesApiExceptions;

    class {$module}Controller extends Controller
    {
        use HandlesApiExceptions;

        protected \${$serviceVar};

        public function __construct({$module}Service \${$serviceVar})
        {
            \$this->{$serviceVar} = \${$serviceVar};
        }

        public function index(): JsonResponse
        {
            \$data = \$this->{$serviceVar}->all();
            return \$this->successResponse({$module}Resource::collection(\$data));
        }


        public function store({$module}Request \$request): JsonResponse
        {
            return \$this->handleApiExceptions(function () use (\$request) {
                \$validatedData = \$request->validated();
                \${$serviceModelName} = \$this->{$serviceVar}->create(\$validatedData);
                return \$this->createdResponse(\${$serviceModelName});
            });
        }

        public function show(\$id): JsonResponse
        {
            \$data = \$this->{$serviceVar}->find(\$id);
            return \$this->successResponse(new {$module}Resource(\$data));
        }

        public function update({$module}Request \$request, \$id): JsonResponse
        {
            return \$this->handleApiExceptions(function () use (\$id, \$request) {
                \$validatedData = \$request->validated();
                \${$serviceModelName} = \$this->{$serviceVar}->update(\$id, \$validatedData);
                return \$this->updatedResponse(\${$serviceModelName});
            });
        }

        public function destroy(\$id): JsonResponse
        {
            return \$this->handleApiExceptions(function () use (\$id) {
                \$this->{$serviceVar}->delete(\$id);
            return \$this->deletedResponse();
            });
        }
    }
    PHP;

        $controllerPath = "$controllerDirectory/{$module}Controller.php";
        File::put($controllerPath, $controllerContent);
        $this->info("Controller dosyası oluşturuldu: $controllerPath");
    }


    protected function createResource($modulePath, $module)
    {
        $resourceDirectory = "$modulePath/Http/Resources";
        if (!File::exists($resourceDirectory)) {
            File::makeDirectory($resourceDirectory, 0755, true);
        }

        $resourceContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Http\\Resources;

    use Illuminate\\Http\\Resources\\Json\\JsonResource;

    class {$module}Resource extends JsonResource
    {
        public function toArray(\$request)
        {
            return [
                'id' => \$this->id,
                'name' => \$this->name,
                'created_at' => \$this->created_at?->toDateTimeString(),
                'updated_at' => \$this->updated_at?->toDateTimeString(),
            ];
        }
    }
    PHP;

        $resourcePath = "$resourceDirectory/{$module}Resource.php";
        File::put($resourcePath, $resourceContent);
        $this->info("Resource oluşturuldu: $resourcePath");
    }


    protected function createObserver($modulePath, $module)
    {
        $observerDirectory = "$modulePath/Observers";
        if (!File::exists($observerDirectory)) {
            File::makeDirectory($observerDirectory, 0755, true);
        }

        $observerContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Observers;

    use App\\Modules\\$module\\Models\\{$module};

    class {$module}Observer
    {
        public function created({$module} \$model)
        {
            // Oluşturma işlemi gözlemlendi
        }

        public function updated({$module} \$model)
        {
            // Güncelleme işlemi gözlemlendi
        }

        public function deleted({$module} \$model)
        {
            // Silme işlemi gözlemlendi
        }
    }
    PHP;

        $observerPath = "$observerDirectory/{$module}Observer.php";
        File::put($observerPath, $observerContent);
        $this->info("Observer oluşturuldu: $observerPath");
    }


    protected function createMail($modulePath, $module)
    {
        $mailDirectory = "$modulePath/Mail";
        if (!File::exists($mailDirectory)) {
            File::makeDirectory($mailDirectory, 0755, true);
        }

        $mailContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Mail;

    use Illuminate\\Bus\\Queueable;
    use Illuminate\\Contracts\\Queue\\ShouldQueue;
    use Illuminate\\Mail\\Mailable;
    use Illuminate\\Queue\\SerializesModels;

    class {$module}Notification extends Mailable
    {
        use Queueable, SerializesModels;

        public \$data;

        public function __construct(\$data)
        {
            \$this->data = \$data;
        }

        public function build()
        {
            return \$this->subject('Yeni {$module} Bildirimi')
                        ->view('modules.$module.emails.notification')
                        ->with(['data' => \$this->data]);
        }
    }
    PHP;

        $mailPath = "$mailDirectory/{$module}Notification.php";
        File::put($mailPath, $mailContent);
        $this->info("Mail oluşturuldu: $mailPath");
    }


    protected function createRequest($modulePath, $module)
    {
        $requestDirectory = "$modulePath/Http/Requests";
        if (!File::exists($requestDirectory)) {
            File::makeDirectory($requestDirectory, 0755, true);
        }

        $requestContent = <<<PHP
    <?php

    namespace App\\Modules\\$module\\Http\\Requests;

    use Illuminate\\Foundation\\Http\\FormRequest;

    class {$module}Request extends FormRequest
    {
        public function authorize()
        {
            // Burada yetkilendirme kontrolü ekleyebilirsin.
            return true;
        }

        public function rules()
        {
            return [
                'name' => ['required', 'string', 'max:255'],
            ];
        }
    }
    PHP;

        $requestPath = "$requestDirectory/{$module}Request.php";
        File::put($requestPath, $requestContent);
        $this->info("Request oluşturuldu: $requestPath");
    }


    protected function createServiceProvider($modulePath, $module)
    {
        $providerDirectory = "$modulePath/Providers";
        if (!File::exists($providerDirectory)) {
            File::makeDirectory($providerDirectory, 0755, true);
        }

        $providerContent = <<<PHP
<?php

namespace App\\Modules\\$module\\Providers;

use Illuminate\\Support\\ServiceProvider;

class {$module}ServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        \$this->mergeConfigFrom(
            app_path("Modules/$module/config.php"), "{$module}Module"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("{$module}Module.active") === true) {
            // Rotaları yükle
            \$this->loadMigrationsFrom(app_path("Modules/$module/database/migrations"));

            if (file_exists(\$routesPath = app_path("Modules/$module/routes/api.php"))) {
                \$this->loadRoutesFrom(\$routesPath);
            }
        }
    }
}
PHP;

        $providerPath = "$providerDirectory/{$module}ServiceProvider.php";
        File::put($providerPath, $providerContent);
        $this->info("ServiceProvider dosyası oluşturuldu: $providerPath");

        $this->updateAppServiceProvider($module);
    }


    protected function updateAppServiceProvider($module)
    {
        $appServiceProviderPath = app_path('Providers/AppServiceProvider.php');

        if (!File::exists($appServiceProviderPath)) {
            return;
        }

        $appServiceProviderContent = File::get($appServiceProviderPath);
        $serviceProvider = "        \$this->app->register({$module}ServiceProvider::class);";
        $useStatement = "use App\\Modules\\$module\\Providers\\{$module}ServiceProvider;";

        // `use` satırını ekle (varsa tekrar ekleme)
        if (!str_contains($appServiceProviderContent, $useStatement)) {
            $appServiceProviderContent = preg_replace(
                '/^namespace .*?;/m',
                "$0\n$useStatement",
                $appServiceProviderContent,
                1
            );
        }

        // `register` metodunun içine ServiceProvider ekle (varsa tekrar ekleme)
        if (!str_contains($appServiceProviderContent, $serviceProvider)) {
            // `register` metodunun başını bulacak şekilde genişletiyoruz
            $appServiceProviderContent = preg_replace_callback(
                '/public function register\(\)\s*(:\s*void)?\s*{/',
                function($matches) use ($serviceProvider) {
                    // Eğer register metodu boşsa, içerisine ekleme yapalım
                    return $matches[0] . "\n    // Register services\n" . $serviceProvider;
                },
                $appServiceProviderContent
            );
        }

        File::put($appServiceProviderPath, $appServiceProviderContent);
        $this->info("AppServiceProvider'a {$module}ServiceProvider başarıyla eklendi!");
    }


}
