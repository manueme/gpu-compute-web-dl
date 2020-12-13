# December Labs - GPU Compute Demo

## Introduction

This repository contains a demo of the additional rendering context added to WebGL2.
For more information about this feature visit: https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/

## Purpose

As a complement to a presentation on the applicability of the GPU in web applications, we use this simple React application as an example to apply the computing techniques available through webgl.

## Usage

### Enable Webgl2 Compute

_(December 2020 note) -_ The WebGL Compute feature works only (and it will most likely remain working only) on Windows and Linux.

To enable this feature on Chromium browsers enable the following command line flag:

`--enable-webgl2-compute-context` 

**Edge:** [edge://flags/#enable-webgl2-compute-context](edge://flags/#enable-webgl2-compute-context)

**Chrome:** [chrome://flags/#enable-webgl2-compute-context](chrome://flags/#enable-webgl2-compute-context)

### Available scripts

#### `yarn start` 

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Don't forget to add the compute flag.

#### `yarn build`

Builds the app for production to the `build` folder.
