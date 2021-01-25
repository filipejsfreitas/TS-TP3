cmake_minimum_required(VERSION 3.0 FATAL_ERROR)
project(fuse-module VERSION 0.0.1 LANGUAGES C)

set (CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/CMake/")

find_package(FUSE REQUIRED)

set(CMAKE_C_FLAGS "-D_FILE_OFFSET_BITS=64 -lulockmgr")

add_executable(fuse-module passthrough.c)

target_include_directories(fuse-module PRIVATE ${FUSE_INCLUDE_DIR})
target_link_libraries(fuse-module ${FUSE_LIBRARIES})
