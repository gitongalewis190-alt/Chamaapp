-- 028 (optional, NOT applied): clears the one new advisor warning, "function_search_path_mutable" on private.local_phone.
-- The function only uses built-in functions, so a fixed, empty search path changes nothing about what it does.
alter function private.local_phone(text) set search_path = '';
