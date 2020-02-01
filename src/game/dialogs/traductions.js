import { talkToMyself } from "../utils/dialog"

export const traductions = {
    traduction_tableau: {
        lines: [`Que tout le monde se rassemble au terrier`],
        after(save){
            save.hasDiscoveredTerrier = true
        }
	},

	traduction_souche: {
        lines: [
		`Ne passez plus par le pont de la rivière.`,
        `Le vieux Ramsey devient un peu trop curieux...`
        ]
    },

	traduction_camp_ramsey: {
        lines: [
            `Nous nous sommes occupés de Ramsey.`,
		    `Rassemblez-vous au terrier pour le rituel.`
        ],
        after(save){
            save.isRamseyMissing = true;
            return talkToMyself([
                `Qui a pu kidnapper Ramsey ? Les dévots ? Les étudiants ?`,
                save.hasMetRamsey ? `Ramsey avait parlé de capes noires...` : `Je le saurais une fois que je serais rentré dans ce "terrier".`,
                `Ils n'ont pas touché au reste du camp.`
            ])
        }
    }

}