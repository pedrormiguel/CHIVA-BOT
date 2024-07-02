import { createFlow } from '@builderbot/bot';
import { flowRegister } from './register.flow';
import { flowWelcome } from './welcome.flow';

export const flow = createFlow([flowWelcome, flowRegister])
