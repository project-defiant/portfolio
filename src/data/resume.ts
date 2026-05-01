export type ResumeSectionId = 'experience' | 'education' | 'service';

export interface ResumeSection {
	id: ResumeSectionId;
	title: string;
	description: string;
}

export interface ResumeEntry {
	section: ResumeSectionId;
	organization: string;
	role: string;
	period: string;
	location?: string;
	summary: string;
	highlights?: string[];
	skills?: string[];
}

export const resumeSummary = [
	'Senior computational biologist and bioinformatics software developer bridging genomics, data curation, and delivery across research, diagnostics, and product teams.',
	'I work best where sequencing-heavy science needs clear software, practical communication, and enough product sense to move from analysis into repeatable delivery.',
];

export const resumeSections: ResumeSection[] = [
	{
		id: 'experience',
		title: 'Experience',
		description: 'Research, diagnostics, and software delivery roles shown in reverse chronological order.',
	},
	{
		id: 'education',
		title: 'Education',
		description: 'Formal study, postgraduate training, and laboratory placements that shaped the current profile.',
	},
	{
		id: 'service',
		title: 'Service',
		description: 'University service and representative work that strengthened communication and stewardship.',
	},
];

export const resumeEntries: ResumeEntry[] = [
	{
		section: 'experience',
		organization: 'Open Targets',
		role: 'Senior Computational Biologist',
		period: 'Current',
		location: 'Wellcome Genome Campus, Cambridge',
		summary:
			'Build and improve target-discovery informatics by combining computational biology, large-scale data interpretation, and delivery discipline for public-facing biomedical platforms.',
		skills: ['Computational biology', 'Target discovery', 'Genomics', 'Platform delivery'],
	},
	{
		section: 'experience',
		organization: 'Data Curators',
		role: 'Bioinformatics and data curation collaborator',
		period: 'Current',
		summary:
			'Support data-heavy life science work that benefits from careful normalization, reviewable evidence handling, and pragmatic collaboration across technical and domain stakeholders.',
		skills: ['Data curation', 'Evidence review', 'Knowledge organization'],
	},
	{
		section: 'experience',
		organization: 'QuartzBio',
		role: 'Software Developer, Virtual Sample Inventory',
		period: 'Recent',
		summary:
			'Maintained and refactored legacy R-heavy product code, planned new solutions, and expanded automated test coverage for sample inventory workflows.',
		skills: ['R', 'Refactoring', 'Test coverage', 'Product maintenance'],
	},
	{
		section: 'experience',
		organization: 'Self Development',
		role: 'Independent learning and Project Defiant development',
		period: 'Ongoing',
		summary:
			'Continuously deepen software engineering skills across web development, Rust, Scala, and portfolio storytelling while turning Project Defiant into a clearer public collaboration surface.',
		skills: ['Web development', 'Rust', 'Scala', 'Technical communication'],
	},
	{
		section: 'experience',
		organization: 'MNM Diagnostics',
		role: 'Software Engineer / Bioinformatics Developer',
		period: 'Earlier',
		summary:
			'Built analysis tools for whole-genome and panel sequencing, packaged bioinformatics utilities in R and Python, and learned startup-grade delivery across cloud-native and testing-heavy workflows.',
		highlights: [
			'Worked with Docker, AWS S3, DVC, pytest, Flask documentation sites, and Nextflow pipelines.',
			'Used PySpark, Delta Lake, and Glow to improve genomic VCF processing efficiency.',
			'Delivered tools for whole-genome sequencing analysis and genomic feature extraction from tumour descriptors.',
		],
		skills: ['Python', 'R', 'PySpark', 'Nextflow', 'AWS', 'TDD'],
	},
	{
		section: 'experience',
		organization: "Children's Health Memorial Institute",
		role: 'Junior Assistant Biotechnologist, Genetics Department',
		period: 'Earlier',
		location: 'Warsaw',
		summary:
			'Supported rare-disease genetics work through variant interpretation, sequencing result review, and day-to-day collaboration with laboratory analysts, doctors, and patients.',
		highlights: [
			'Worked with BAM and VCF analysis from targeted sequencing and whole-exome sequencing workflows.',
			'Applied ACMG-oriented rare variant classification using resources such as ClinVar, OMIM, HGMD, LOVD, gnomAD, Reactome, and HPO.',
			'Contributed to a funded infrastructure grant for in-house genomics compute and storage.',
		],
		skills: ['Rare disease genomics', 'ACMG classification', 'NGS analysis'],
	},
	{
		section: 'experience',
		organization: 'Aflofarm',
		role: 'Early industry biotechnology exposure',
		period: 'Earlier',
		summary:
			'Gained early exposure to industrial biotech expectations and regulated delivery, reinforcing the value of disciplined execution before moving fully into genomics and software.',
		skills: ['Biotechnology', 'Industry collaboration'],
	},
	{
		section: 'education',
		organization: 'ICM UW HEAP trainee',
		role: 'HEAP metagenomics pipelines trainee',
		period: 'Postgraduate training',
		summary:
			'Built practical experience around large-scale omics processing, HPC environments, and pipeline-oriented work during HEAP-focused training at the Interdisciplinary Centre for Mathematical and Computational Modelling, University of Warsaw.',
		skills: ['HPC', 'Slurm', 'Metagenomics', 'Pipeline development'],
	},
	{
		section: 'education',
		organization: 'ICM UW Omics postgraduate',
		role: 'Postgraduate studies in OMICS Data Science',
		period: 'Postgraduate studies',
		summary:
			'Strengthened coding and analysis foundations across Python, R, C, PySpark, Bioconductor, multiomics, and applied machine learning for sequencing-heavy data.',
		skills: ['OMICS Data Science', 'Python', 'R', 'Bioconductor', 'Machine learning'],
	},
	{
		section: 'education',
		organization: 'Intercollegiate Faculty of Biotechnology trainee',
		role: 'Laboratory trainee',
		period: 'University placement',
		location: 'Gdańsk',
		summary:
			'Completed an internship focused on purification of small heat shock proteins in E. coli, building discipline in experimental planning, organization, and time management.',
		skills: ['Protein purification', 'Laboratory work', 'Time management'],
	},
	{
		section: 'education',
		organization: 'Lodz University of Technology degree',
		role: "Engineer’s degree in Technical Biochemistry",
		period: 'Degree',
		location: 'Łódź',
		summary:
			'Graduated in biotechnology with a diploma project on de novo assembly of plasmid sequences of Komagataeibacter xylinus, using the work to transition decisively into bioinformatics.',
		highlights: [
			'Learned the sequencing and assembly basics behind IGV, SPAdes, QUAST, Linux, Bash, and Python workflows.',
			'Built confidence in tackling unfamiliar technical domains through genomics-focused diploma research.',
		],
		skills: ['Biotechnology', 'Bioinformatics', 'Bash', 'Python', 'Genome assembly'],
	},
	{
		section: 'service',
		organization: 'Lodz University senate/service',
		role: 'Student representation and academic service',
		period: 'University years',
		location: 'Łódź',
		summary:
			'Contributed to student-facing university service, developing communication, stewardship, and collaborative habits that still shape cross-functional work today.',
		skills: ['Representation', 'Communication', 'Teamwork'],
	},
];

export function getResumeEntries(section: ResumeSectionId) {
	return resumeEntries.filter((entry) => entry.section === section);
}
