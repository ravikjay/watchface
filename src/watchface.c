#include <pebble.h>

static Window *s_main_window;

static TextLayer *s_time_layer;
static TextLayer *s_weather_layer; 

static BitmapLayer *s_background_layer;
static GBitmap *s_background_bitmap;

static GFont s_weather_font;
static GFont s_time_font;

static void update_time()
{
    // Get a tm structure to work with
    time_t temp = time(NULL);
    struct tm *tick_time = localtime(&temp);
    
    // Create a perisistent buffer
    static char buffer[] = "00:00";
    
    // Write the current hours and minutes into the buffer
    if (clock_is_24h_style() == true)
    {
        // Use the 24 hr format
        strftime(buffer, sizeof("00:00"), "%H:%M", tick_time);
    }
    else
    {
        // If not, use the 12 hr format
        strftime(buffer, sizeof("00:00"), "%I:%M", tick_time);
    }
    
    // Display this time on the TextLayer we've created
    text_layer_set_text(s_time_layer, buffer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed)
{
    update_time();
}


static void main_window_load (Window *window)
{
    // Create GBitmap, then set to created BitmapLayer
    s_background_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_BACKGROUND);
    s_background_layer = bitmap_layer_create(GRect(0, 0, 144, 168));
    bitmap_layer_set_bitmap(s_background_layer, s_background_bitmap);
    layer_add_child(window_get_root_layer(window), bitmap_layer_get_layer(s_background_layer));

    // Create time TextLayer
    s_time_layer = text_layer_create(GRect(5, 52, 139, 50));
    text_layer_set_background_color(s_time_layer, GColorClear);
    text_layer_set_text_color(s_time_layer, GColorBlack);
    text_layer_set_text(s_time_layer, "00:00");
    
    s_time_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_48));;
    
    // Make it look nice and watch-like
    text_layer_set_font(s_time_layer, s_time_font);
    text_layer_set_text_alignment(s_time_layer, GTextAlignmentCenter);
    
    // Make this created text layer a child of the overall root layer to the watchface
    layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_time_layer));

    // Create weather TextLayer
    s_weather_layer = text_layer_create(GRect(0, 130, 144, 25));
    text_layer_set_background_color(s_weather_layer, GColorClear);
    text_layer_set_text_color(s_weather_layer, GColorWhite);
    text_layer_set_text_alignment(s_weather_layer, GTextAlignmentCenter);
    text_layer_set_text(s_weather_layer, "Loading...");

    // Create second custom font, apply it and add to Window
    s_weather_font = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_PERFECT_DOS_20));
    text_layer_set_font(s_weather_layer, s_weather_font);
    layer_add_child(window_get_root_layer(window), text_layer_get_layer(s_weather_layer));

    // Make sure the time is displayed from the start
    update_time();
}

static void main_window_unload (Window *window)
{
    // Destroy the time layer
    fonts_unload_custom_font(s_time_font);

    //Destroy GBitmap
    gbitmap_destroy(s_background_bitmap);

    // Destroy Bitmaplayer
    bitmap_layer_destroy(s_background_layer);

    text_layer_destroy(s_time_layer);

    // Destroy weather elements
    text_layer_destroy(s_weather_layer);
    fonts_unload_custom_font(s_weather_font);
}

static void init()
{
    // Create main Window element and assign to pointer
    s_main_window = window_create();
    
    // Set handlers to manage the elements inside the Window
    window_set_window_handlers(s_main_window, (WindowHandlers) {
        .load = main_window_load,
        .unload = main_window_unload
    });
    
    // Show the Window on the watch, with animated=true
    window_stack_push(s_main_window, true);
    
    // Register with TickTimerService
    tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
}

static void deinit()
{
    // Destroy Window to return memory
    window_destroy(s_main_window);
}

int main (void)
{
    init();
    app_event_loop();
    deinit();
}