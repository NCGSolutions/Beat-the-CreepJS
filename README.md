# Beat the Creep

Beat the Creep is a project designed to challenge the fingerprinting techniques employed by the [CreepJS website](https://abrahamjuliot.github.io/creepjs). Leveraging Puppeteer and evasion strategies, this project aims to navigate through the website's sophisticated detection mechanisms, achieving a 100% A+ score, and demonstrating the potential to preserve privacy and anonymity online against sophisticated fingerprinting methods.


## Implemented Techniques

- **Residential IP Proxy Rotation**: Utilizes `getRandomResidentialProxy` for dynamic IP address management, crucial for evading network-level fingerprinting.
- **Dynamic Interaction**: Incorporates `wait` with `getRandomNumber` for variable delay times and `typeWithRandomSpeed` for human-like typing behavior, enhancing the bot's ability to mimic human interactions.
- **User Agent Rotation**: While the initial strategy included rotating user agents via `getRandomUserAgent`, this was adjusted to optimize the score, reflecting the project's adaptive approach to evasion.

## Getting Started

To explore and utilize Beat the Creep, follow these steps:

```bash
git clone https://github.com/NCGSolutions/CreepJS.git
cd CreepJS
npm install
```
## Usage

After installation, run the `creep.js` script to initiate the process.

### Future Advancements: Spoofing the Fingerprint in Chromium using a Custom Built Patch

A key strategic enhancement involves advanced fingerprint spoofing by directly modifying Chromium's source code. This would allow for the spoofing of the `GL_RENDERER` string or other parameters used to fingerprint users, crucial in the WebGL context, to evade detection mechanisms that rely on GPU information for fingerprinting.

#### Steps to Spoof GL_RENDERER

1. **Locate and Modify the GetGLString Function**:
   The `GetGLString` function in Chromium's source is responsible for fetching various OpenGL strings, including the GPU renderer information. By modifying its implementation, we can force it to return a custom string, thereby spoofing the GPU renderer information reported to websites.

    ```cpp
    std::string GetGLString(unsigned int pname) {
      if (pname == GL_RENDERER) {
        return "Spoofed GPU Renderer"; // Spoofed value
      }
      const char* gl_string = reinterpret_cast<const char*>(glGetString(pname));
      return gl_string ? std::string(gl_string) : std::string();
    }
    ```

2. **Recompile Chromium**:
   After applying the patch, the next step is to recompile Chromium. This process can be quite involved, given Chromium's extensive build system and dependencies. The recompilation ensures that the modifications are integrated into the browser, allowing for the spoofed information to be used.

3. **Testing the Modification**:
   Testing your custom build of Chromium is essential to ensure that the spoofed `GL_RENDERER` string is being correctly reported. This can be verified by accessing web pages or applications that display or log GPU information.

#### Exposing an API for Dynamic Spoofing via Puppeteer

To further enhance the utility and flexibility of this spoofing technique, integrating an API that allows for dynamic modification of the `GL_RENDERER` value at runtime would be a significant advancement. Such an API could be controlled through Puppeteer, enabling scripts to adjust the spoofed value based on specific needs or to evade detection mechanisms dynamically.

Implementing this feature requires modifying Chromium to accept external inputs (e.g., through command-line arguments or environment variables) that dictate the `GL_RENDERER` value. Puppeteer scripts could then launch Chromium with these parameters, seamlessly integrating the spoofing capability into automated workflows.

## License

Beat the Creep is open-sourced under the MIT license. See the LICENSE file in the repository for full details.
